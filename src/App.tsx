import { useEffect, useState } from 'react';
import { Bell, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { CompanyProvider } from './context/CompanyContext';
import { useCompany } from './context/useCompany';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LANGUAGES } from './utils/translations';
import { getMenuItemImage } from './utils/imageGenerator';
import { getTranslatedDescription } from './utils/descriptionTranslations';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
const BASE_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

interface Table {
  id: string;
  table_number: number;
  qr_token: string;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'entradas' | 'principales' | 'bebidas' | 'postres';
  image_url: string | null;
  is_available: boolean;
}

function AppContent() {
  const { company } = useCompany();
  const { t, language, setLanguage } = useLanguage();
  const [table, setTable] = useState<Table | null>(null);
  const [loading, setLoading] = useState(true);
  const [called, setCalled] = useState(false);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentView, setCurrentView] = useState<'menu' | 'profile'>('menu');

  // Menu state
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Update gradient when company colors change
  useEffect(() => {
    if (company) {
      const root = document.documentElement;
      const gradient = `linear-gradient(135deg, ${company.primary_color}, ${company.secondary_color})`;
      root.style.setProperty('--gradient-primary', gradient);
    }
  }, [company?.primary_color, company?.secondary_color]);

  useEffect(() => {
    // Get token from URL
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (!token) {
      setError(t('error.invalidToken'));
      setLoading(false);
      return;
    }

    // Load table info first
    loadTable(token);
    // Load menu
    loadMenu();
  }, [t]);

  // Initialize socket once table is loaded
  useEffect(() => {
    if (!table) return;

    // Initialize socket
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket'],
    });

    newSocket.on('connect', () => {
      console.log('Connected to server');
      newSocket.emit('client:connect', { tableId: table.id });
    });

    newSocket.on('client:request_sent', (data) => {
      if (data.success) {
        setCalled(true);
        // Reset after 30 seconds
        setTimeout(() => setCalled(false), 30000);
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [table]);
  const loadTable = async (token: string) => {
    try {
      const response = await axios.get(`${API_URL}/tables/token/${token}`);
      setTable(response.data);
    } catch {
      setError(t('error.tableNotFound'));
    } finally {
      setLoading(false);
    }
  };

  const loadMenu = async () => {
    try {
      const response = await axios.get(`${API_URL}/menu`);
      setMenuItems(response.data);
    } catch (_err) {
      console.error('Error loading menu:', _err);
    }
  };

  const handleCallWaiter = async () => {
    if (!table || !socket) return;

    try {
      // Create service request
      const response = await axios.post(`${API_URL}/requests`, {
        table_id: table.id,
      });

      // Emit socket event
      socket.emit('client:call_waiter', {
        tableId: table.id,
        tableNumber: table.table_number,
        requestId: response.data.id,
      });

      setCalled(true);
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } } };
      setError(error.response?.data?.error || 'Error al llamar al mesero');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>{t('error.loading')}</p>
      </div>
    );
  }

  if (error && !table) {
    return (
      <div className="container">
        <div className="card">
          <h2>⚠️ Error</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
            {error}
          </p>
        </div>
      </div>
    );
  }

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  if (currentView === 'profile') {
    return (
      <div className="container" style={{ paddingBottom: '100px' }}>
        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="title">🏪 {company?.name || 'Tu Resto'}</h1>
          <button
            onClick={() => setCurrentView('menu')}
            style={{
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              background: 'var(--accent-purple)',
              color: '#fff',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}
          >
            ← {t('button.backToMenu')}
          </button>
        </div>

        <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
          <div style={{
            padding: '2rem',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#333',
            textAlign: 'center'
          }}>
            <h2 style={{ marginBottom: '1rem' }}>📋 {t('profile.tableInfo')}</h2>
            <div style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
              <p><strong>{t('profile.tableNumber')}:</strong> {table?.table_number}</p>
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
                {t('profile.token')}: {table?.qr_token?.substring(0, 8)}...
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              borderRadius: '8px',
              background: '#f0f0f0',
              marginTop: '2rem'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>ℹ️ {t('profile.about')} {company?.name || 'Tu Resto'}</h3>
              <p style={{ margin: 0, color: '#666' }}>
                {t('profile.welcome')}
              </p>
            </div>

            {company?.logo && (
              <div style={{ marginTop: '2rem' }}>
                <img 
                  src={`${BASE_URL}${company.logo}`}
                  alt={company.name}
                  style={{ maxHeight: '100px', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ 
      paddingBottom: '100px',
      backgroundImage: company?.background_image ? `url(${BASE_URL}${company.background_image})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="header">
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {company?.menu_logo ? (
            <img
              src={`${BASE_URL}${company.menu_logo}`}
              alt={company.name}
              style={{ maxHeight: '60px', objectFit: 'contain', marginBottom: '0.5rem' }}
            />
          ) : null}
          <h1 className="title">{company?.name || 'Tu Resto'}</h1>
          <div className="table-badge">Mesa {table?.table_number}</div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="categories-nav" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', gap: '0.5rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', flex: 1 }}>
          {['all', 'entradas', 'principales', 'bebidas', 'postres'].map(cat => (
            <button
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {t(`category.${cat}`)}
            </button>
          ))}
        </div>
        
        {/* Language Selector */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value as keyof typeof LANGUAGES)}
          style={{
            padding: '0.5rem 0.75rem',
            borderRadius: '8px',
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border-color)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            minWidth: '120px',
          }}
        >
          {Object.entries(LANGUAGES).map(([lang, { name, flag }]) => (
            <option key={lang} value={lang} style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}>
              {flag} {name}
            </option>
          ))}
        </select>
      </div>

      {/* Menu Grid */}
      <div className="menu-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="menu-item-card">
              <div className="menu-item-image">
                {item.image_url ? (
                  <img
                    src={item.image_url?.startsWith('http') ? item.image_url : `${BASE_URL}${item.image_url}`}
                    alt={item.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = getMenuItemImage(item.name, item.category);
                    }}
                  />
                ) : (
                  <img
                    src={getMenuItemImage(item.name, item.category)}
                    alt={item.name}
                  />
                )}
              </div>
              <div className="menu-item-content">
                <div className="menu-item-header">
                  <h3 className="menu-item-title">{item.name}</h3>
                  <span className="menu-item-price">${item.price.toFixed(2)}</span>
                </div>
                <p className="menu-item-desc">{getTranslatedDescription(item.description, language)}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>{t('menu.noItems')}</p>
          </div>
        )}
      </div>

      {/* Sticky Call Button */}
      <div className="sticky-footer">
        <button
          className={`call-button ${called ? 'success' : 'primary'}`}
          onClick={handleCallWaiter}
          disabled={called}
        >
          {called ? (
            <>
              <CheckCircle size={24} />
              <span>{t('button.waiterNotified')}</span>
            </>
          ) : (
            <>
              <Bell size={24} className={!called ? 'pulse' : ''} />
              <span>{t('button.callWaiter')}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <CompanyProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </CompanyProvider>
  );
}

export default App;
