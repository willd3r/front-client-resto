import React, { useEffect, useState } from 'react';
import { Bell, CheckCircle, UtensilsCrossed } from 'lucide-react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';
import { CompanyProvider } from './context/CompanyContext';
import { useCompany } from './context/useCompany';
import { getMenuItemImage } from './utils/imageGenerator';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

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

const CATEGORIES = [
  { value: 'all', label: '🍽️ Todos' },
  { value: 'entradas', label: '🥗 Entradas' },
  { value: 'principales', label: '🍖 Principales' },
  { value: 'bebidas', label: '🥤 Bebidas' },
  { value: 'postres', label: '🍰 Postres' },
];

function AppContent() {
  const { company } = useCompany();
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
      setError('Token QR inválido');
      setLoading(false);
      return;
    }

    // Load table info first
    loadTable(token);
    // Load menu
    loadMenu();
  }, []);

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
    } catch (err) {
      setError('Mesa no encontrada');
    } finally {
      setLoading(false);
    }
  };

  const loadMenu = async () => {
    try {
      const response = await axios.get(`${API_URL}/menu`);
      setMenuItems(response.data);
    } catch (err) {
      console.error('Error loading menu:', err);
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
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al llamar al mesero');
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Cargando...</p>
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
            ← Volver al Menú
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
            <h2 style={{ marginBottom: '1rem' }}>📋 Información de tu Mesa</h2>
            <div style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
              <p><strong>Número de Mesa:</strong> {table?.table_number}</p>
              <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
                Token: {table?.qr_token?.substring(0, 8)}...
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              borderRadius: '8px',
              background: '#f0f0f0',
              marginTop: '2rem'
            }}>
              <h3 style={{ marginTop: 0, marginBottom: '1rem' }}>ℹ️ Acerca de {company?.name || 'Tu Resto'}</h3>
              <p style={{ margin: 0, color: '#666' }}>
                Bienvenido a nuestra plataforma de pedidos digital. 
                Aquí puedes ver el menú, realizar pedidos y comunicarte con nuestro equipo.
              </p>
            </div>

            {company?.logo && (
              <div style={{ marginTop: '2rem' }}>
                <img 
                  src={`http://localhost:3000${company.logo}`}
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
      backgroundImage: company?.background_image ? `url(http://localhost:3000${company.background_image})` : 'none',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="header">
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          {company?.menu_logo ? (
            <img
              src={`http://localhost:3000${company.menu_logo}`}
              alt={company.name}
              style={{ maxHeight: '60px', objectFit: 'contain', marginBottom: '0.5rem' }}
            />
          ) : null}
          <h1 className="title">{company?.name || 'Tu Resto'}</h1>
          <div className="table-badge">Mesa {table?.table_number}</div>
        </div>
      </div>

      {/* Categories Navigation */}
      <div className="categories-nav">
        {CATEGORIES.map(cat => (
          <button
            key={cat.value}
            className={`category-pill ${activeCategory === cat.value ? 'active' : ''}`}
            onClick={() => setActiveCategory(cat.value)}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="menu-grid">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="menu-item-card">
              <div className="menu-item-image">
                {item.image_url ? (
                  <img
                    src={item.image_url?.startsWith('http') ? item.image_url : `http://localhost:3000${item.image_url}`}
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
                <p className="menu-item-desc">{item.description}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <p>No hay platillos disponibles en esta categoría.</p>
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
              <span>Mesero Notificado</span>
            </>
          ) : (
            <>
              <Bell size={24} className={!called ? 'pulse' : ''} />
              <span>Llamar Mesero</span>
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
      <AppContent />
    </CompanyProvider>
  );
}

export default App;
