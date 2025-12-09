# 🍽️ FLUJO COMPLETO DEL MENÚ DEL CLIENTE

**Documento visual: Cómo funciona la estructura completa del cliente step-by-step**

---

## 📱 Vista del Cliente (Pantalla Móvil)

```
┌─────────────────────────────────────────┐
│                                         │
│         [LOGO DEL RESTAURANTE]          │  ← company.menu_logo
│        Mi Restaurante Favorito          │  ← company.name
│              Mesa 5                     │  ← table.table_number
│                                         │
├─────────────────────────────────────────┤
│ [Todos] [Entradas] [Principales] [...]  │ [ES ▼]  ← selector idioma
├─────────────────────────────────────────┤
│ FONDO: company.background_image         │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │       [IMAGEN ITEM]               │   │
│ │      Pollo Asado Grillé           │   │ ← item.name
│ │                                   │   │
│ │  Pollo tierno a la parrilla con   │   │ ← getTranslatedDescription
│ │  especias caseras y aceite de     │   │    (cambia con idioma)
│ │  oliva virgen extra               │   │
│ │                                   │   │
│ │                       $12.50      │   │ ← item.price
│ └───────────────────────────────────┘   │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │       [IMAGEN ITEM]               │   │
│ │      Ensalada César               │   │
│ │  Lechuga romana, queso parmesan.. │   │
│ │                       $8.50       │   │
│ └───────────────────────────────────┘   │
│                                         │
│ ┌───────────────────────────────────┐   │
│ │       [IMAGEN ITEM]               │   │
│ │      Pasta Marinera               │   │
│ │  Fideos frescos con mariscos...   │   │
│ │                       $14.00      │   │
│ └───────────────────────────────────┘   │
│                                         │
├─────────────────────────────────────────┤
│        [🔔 LLAMAR MESERO]               │ ← sticky footer
│         (O "MESERO NOTIFICADO")         │
└─────────────────────────────────────────┘
```

---

## 🔄 Flujo de Carga de Datos

```
┌──────────────────────────────────────────────────────────┐
│ 1. CLIENTE ACCEDE CON TOKEN                             │
│    URL: https://front-client-resto.vercel.app?token=xyz │
└────────────────────┬─────────────────────────────────────┘
                     │
        App.tsx línea 60: URLSearchParams
                     │
         ▼─────────────────────────┐
         
┌──────────────────────────────────────────────────────────┐
│ 2. VALIDA TOKEN EN BACKEND                              │
│    GET /api/tables/token/{token}                         │
│    ↓                                                      │
│    Backend: SELECT * FROM tables WHERE qr_token = ...    │
│    ↓                                                      │
│    Retorna: { id, table_number, qr_token }               │
│    ↓                                                      │
│    setTable(response.data) ✅                            │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 3. CARGA MENÚ DEL BACKEND                               │
│    GET /api/menu                                         │
│    ↓                                                      │
│    Backend: SELECT * FROM menu_items WHERE is_available  │
│    ↓                                                      │
│    Retorna: [                                            │
│      { id, name, price, category, image_url, desc },    │
│      { id, name, price, category, image_url, desc },    │
│      ...                                                 │
│    ]                                                     │
│    ↓                                                      │
│    setMenuItems(response.data) ✅                        │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 4. CARGA DATOS DE EMPRESA                               │
│    GET /api/company/settings                            │
│    ↓                                                      │
│    Backend: SELECT * FROM companies (first record)       │
│    ↓                                                      │
│    Retorna: {                                            │
│      name: "Mi Restaurante",                             │
│      logo: "/uploads/logo/logo.png",                     │
│      menu_logo: "/uploads/logo/menu.png",                │
│      background_image: "/uploads/bg/bg.jpg",             │
│      primary_color: "#FF5733",                           │
│      secondary_color: "#3366FF",                         │
│      theme_name: "light"                                 │
│    }                                                     │
│    ↓                                                      │
│    setCompany(response.data.company) ✅                  │
│    applyTheme(company) → CSS variables dinámicas ✅      │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 5. CONECTA WEBSOCKET                                    │
│    const socket = io(SOCKET_URL)                         │
│    ↓                                                      │
│    socket.emit('client:connect', { tableId })            │
│    ↓                                                      │
│    socket.on('company:updated') → setCompany ✅          │
│    socket.on('client:request_sent') → setCalled ✅       │
│    ↓                                                      │
│    setSocket(socket) ✅                                  │
└────────────────────┬─────────────────────────────────────┘
                     │
                     ▼
┌──────────────────────────────────────────────────────────┐
│ 6. RENDERIZA UI                                         │
│    ✅ Datos listos para mostrar                          │
│    ✅ Componentes renderizados                           │
│    ✅ Estilos aplicados                                  │
│    ✅ Eventos configurados                               │
└──────────────────────────────────────────────────────────┘
```

---

## 🎨 Estados React (App.tsx)

```javascript
// TABLA Y MENÚ
const [table, setTable] = useState<Table | null>(null);
// Llenado por: GET /api/tables/token/{token}
// Contiene: { id, table_number, qr_token, created_at }
// Usado para: Mostrar número de mesa, emit WebSocket

const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
// Llenado por: GET /api/menu
// Contiene: Array de todos los items disponibles
// Usado para: Renderizar items, filtrar por categoría

// FILTRADO Y IDIOMA
const [activeCategory, setActiveCategory] = useState('all');
// Cambia cuando: Usuario hace click en categoría
// Valores: 'all', 'entradas', 'principales', 'bebidas', 'postres'
// Usado para: Filtrar menuItems

const [language, setLanguage] = useState('es');
// Llenado por: localStorage.getItem('language') || idioma navegador
// Cambia cuando: Usuario selecciona idioma
// Usado para: Traducir UI + describir items

// CONEXIÓN Y INTERACCIÓN
const [socket, setSocket] = useState<Socket | null>(null);
// Llenado por: io(SOCKET_URL)
// Usado para: Emitir 'client:call_waiter'

const [called, setCalled] = useState(false);
// Cambia cuando: Usuario hace click en "Llamar Mesero"
// Usado para: Cambiar apariencia del botón

// ESTADO DE CARGA Y ERRORES
const [error, setError] = useState('');
// Llenado por: catch blocks (token inválido, errores API)
// Mostrado: En pantalla como alerta

const [loading, setLoading] = useState(true);
// Falso cuando: Todos los datos están cargados
// Mostrado: Loading spinner mientras carga

const [currentView, setCurrentView] = useState('menu');
// Valores: 'menu' o 'profile'
// Cambia: Usuario hace click en botón "Ver Perfil"
```

---

## 📋 Flujo de Renderizado

### **Paso 1: Renderizar Header**

```typescript
<div className="header">
  <div style={{ textAlign: 'center' }}>
    {company?.menu_logo && (
      <img 
        src={`${BASE_URL}${company.menu_logo}`}  // ← Imagen desde Railway
        alt={company.name}
      />
    )}
    <h1 className="title">{company?.name}</h1>  // ← "Mi Restaurante"
    <div className="table-badge">Mesa {table?.table_number}</div>  // ← "Mesa 5"
  </div>
</div>
```

---

### **Paso 2: Renderizar Navegación**

```typescript
<div className="categories-nav">
  <div style={{ display: 'flex', gap: '0.5rem' }}>
    {['all', 'entradas', 'principales', 'bebidas', 'postres'].map(cat => (
      <button
        key={cat}
        className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
        onClick={() => setActiveCategory(cat)}  // ← Actualiza filtro
      >
        {t(`category.${cat}`)}  // ← Texto en idioma actual
      </button>
    ))}
  </div>
  
  <select
    value={language}
    onChange={(e) => setLanguage(e.target.value)}  // ← Cambia idioma
  >
    {Object.entries(LANGUAGES).map(([lang, { name, flag }]) => (
      <option key={lang} value={lang}>
        {flag} {name}  // ← "🇪🇸 Español", "🇬🇧 English", etc.
      </option>
    ))}
  </select>
</div>
```

---

### **Paso 3: Filtrar Items**

```typescript
const filteredItems = activeCategory === 'all'
  ? menuItems  // ← Si es "all", mostrar todos
  : menuItems.filter(item => item.category === activeCategory);  // ← Si no, filtrar

// Ejemplo: si activeCategory = 'principales'
// Retorna solo items donde category === 'principales'
```

---

### **Paso 4: Renderizar Items**

```typescript
<div className="menu-grid">
  {filteredItems.length > 0 ? (
    filteredItems.map(item => (
      <div key={item.id} className="menu-item-card">
        
        {/* IMAGEN */}
        <div className="menu-item-image">
          {item.image_url ? (
            <img
              src={
                item.image_url?.startsWith('http')
                  ? item.image_url  // ← Si es URL completa, usarla
                  : `${BASE_URL}${item.image_url}`  // ← Si es relativa, construir URL
              }
              alt={item.name}
              onError={(e) => {
                // ← Si falla, usar imagen generada
                (e.target as HTMLImageElement).src = 
                  getMenuItemImage(item.name, item.category);
              }}
            />
          ) : (
            // ← Si no hay imagen, generar una
            <img
              src={getMenuItemImage(item.name, item.category)}
              alt={item.name}
            />
          )}
        </div>
        
        {/* CONTENIDO */}
        <div className="menu-item-content">
          
          {/* TÍTULO Y PRECIO */}
          <div className="menu-item-header">
            <h3 className="menu-item-title">{item.name}</h3>
            <span className="menu-item-price">${item.price.toFixed(2)}</span>
          </div>
          
          {/* DESCRIPCIÓN TRADUCIDA */}
          <p className="menu-item-desc">
            {getTranslatedDescription(item.description, language)}
            {/* 
              item.description = "Pollo asado a la parrilla con especias"
              language = "en"
              ↓
              Retorna: "Roasted chicken on the grill with spices"
            */}
          </p>
          
        </div>
        
      </div>
    ))
  ) : (
    <div className="empty-state">
      <p>{t('menu.noItems')}</p>
    </div>
  )}
</div>
```

---

## 🌐 Traducción en Acción

### **Archivo: translations.ts**

```typescript
// Estructura de traducciones
const TRANSLATIONS = {
  'es': {  // Español
    category: {
      all: 'Todos',
      entradas: 'Entradas',
      principales: 'Principales',
      bebidas: 'Bebidas',
      postres: 'Postres'
    },
    button: {
      callWaiter: 'Llamar Mesero',
      waiterNotified: 'Mesero Notificado'
    },
    error: {
      invalidToken: 'Token inválido o expirado',
      loading: 'Cargando...'
    }
  },
  'en': {  // Inglés
    category: {
      all: 'All',
      entradas: 'Appetizers',
      principales: 'Main Courses',
      bebidas: 'Drinks',
      postres: 'Desserts'
    },
    button: {
      callWaiter: 'Call Waiter',
      waiterNotified: 'Waiter Notified'
    },
    error: {
      invalidToken: 'Invalid or expired token',
      loading: 'Loading...'
    }
  },
  // ... 6 idiomas más (pt, ru, de, fr, it, zh)
}
```

### **Archivo: descriptionTranslations.ts**

```typescript
// Traducciones de descripciones de items
const DESCRIPTION_TRANSLATIONS = {
  'Pollo asado a la parrilla con especias': {
    es: 'Pollo asado a la parrilla con especias',
    en: 'Grilled roasted chicken with spices',
    pt: 'Frango assado na grelha com especiarias',
    ru: 'Курица на гриле с приправами',
    // ... más
  },
  'Lechuga romana con queso parmesano': {
    es: 'Lechuga romana con queso parmesano',
    en: 'Romaine lettuce with parmesan cheese',
    pt: 'Alface romana com queijo parmesão',
    // ... más
  }
}

// Función de traducción
function getTranslatedDescription(originalDesc: string, language: string) {
  // Buscar la descripción original
  // Si existe → retornar traducción
  // Si no existe → retornar descripción original
  
  return DESCRIPTION_TRANSLATIONS[originalDesc]?.[language] || originalDesc;
}
```

### **Cómo funciona:**

```javascript
// Renderizando un item de Pollo Asado
item = {
  name: "Pollo Asado",
  description: "Pollo asado a la parrilla con especias",
  price: 12.50,
  category: "principales"
}

// Usuario está en español (language = 'es')
// getTranslatedDescription(item.description, 'es')
// ↓
// "Pollo asado a la parrilla con especias"

// Usuario cambia a inglés (language = 'en')
// getTranslatedDescription(item.description, 'en')
// ↓
// "Grilled roasted chicken with spices"
// ↓
// Component re-renders automáticamente
```

---

## 🔔 Llamada de Mesero

### **Cuando el usuario hace click en "Llamar Mesero":**

```typescript
const handleCallWaiter = async () => {
  if (!table || !socket) return;

  try {
    // 1. ENVIAR REQUEST AL BACKEND
    const response = await axios.post(`${API_URL}/requests`, {
      table_id: table.id,  // UUID de la mesa
    });
    // Backend: INSERT INTO service_requests (table_id, status, request_time)
    // Retorna: { id, status: 'pending', request_time }

    // 2. EMITIR EVENTO WEBSOCKET
    socket.emit('client:call_waiter', {
      tableId: table.id,
      tableNumber: table.table_number,
      requestId: response.data.id,
    });
    // Backend recibe y emite a todos los admin conectados
    // Admin ve notificación en tiempo real

    // 3. CAMBIAR ESTADO UI
    setCalled(true);  // Botón cambia a "Mesero Notificado"

    // 4. RESETEAR DESPUÉS DE 30 SEGUNDOS
    setTimeout(() => setCalled(false), 30000);
    // Usuario puede llamar nuevamente

  } catch (err: any) {
    setError(err.response?.data?.error || 'Error al llamar al mesero');
  }
};
```

### **En el botón:**

```typescript
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
```

---

## 📸 Manejo de Imágenes

### **Rutas de imágenes:**

```
Backend:
/uploads/
├─ logo/
│  └─ my-logo.png
├─ menu/
│  ├─ pollo.png
│  ├─ ensalada.png
│  └─ ...
└─ background/
   └─ bg.jpg
```

### **URLs Completas en Producción:**

```
Logo: https://back-resto-production.up.railway.app/uploads/logo/my-logo.png
Item: https://back-resto-production.up.railway.app/uploads/menu/pollo.png
Background: https://back-resto-production.up.railway.app/uploads/background/bg.jpg
```

### **Construcción en Cliente:**

```javascript
const BASE_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
// BASE_URL = "https://back-resto-production.up.railway.app"

// Para imagen de item
const fullUrl = item.image_url?.startsWith('http')
  ? item.image_url  // Ya es URL completa
  : `${BASE_URL}${item.image_url}`;  // Construir URL

// Ejemplo: item.image_url = "/uploads/menu/pollo.png"
// fullUrl = "https://back-resto-production.up.railway.app/uploads/menu/pollo.png"
```

### **Fallback inteligente:**

```javascript
<img
  src={fullUrl}
  onError={(e) => {
    // Si la imagen real falla, generar una placeholder
    (e.target as HTMLImageElement).src = 
      getMenuItemImage(item.name, item.category);
  }}
/>

// getMenuItemImage genera SVG placeholder basado en:
// - Nombre del item
// - Categoría (color específico por categoría)
```

---

## 🎨 Aplicación de Colores Dinámicos

```javascript
// CompanyContext.tsx carga datos:
const company = {
  primary_color: "#FF5733",      // Color principal (púrpura, rojo, etc.)
  secondary_color: "#3366FF",    // Color secundario (azul, verde, etc.)
  button_color: "#33FF33",       // Color del botón
  theme_name: "light"            // Tema de color
}

// Aplica colores al documento:
const root = document.documentElement;
root.style.setProperty('--accent-purple', company.primary_color);
root.style.setProperty('--accent-blue', company.secondary_color);
root.style.setProperty('--accent-green', company.button_color);

// En CSS se usan así:
.category-pill {
  background: var(--accent-purple);  // Usa color primario
}

.call-button {
  background: var(--accent-green);   // Usa color del botón
}
```

---

## 🔐 Seguridad y Validación

```javascript
// 1. TOKEN OBLIGATORIO
const token = new URLSearchParams(window.location.search).get('token');
if (!token) {
  setError(t('error.invalidToken'));
  return;
}

// 2. VALIDACIÓN EN BACKEND
GET /api/tables/token/{token}
// Backend verifica que el token exista en la BD
// Si no existe → error 404

// 3. SIN ALMACENAMIENTO DE CREDENCIALES
// El token NO se guarda en localStorage
// Solo en memoria mientras sesión activa

// 4. WEBSOCKET AUTENTICADO
// El servidor sabe a qué mesa pertenece cada cliente
// Solo esa mesa recibe sus notificaciones
```

---

## ✨ Características Avanzadas

### **1. Persistencia de Idioma**

```javascript
// LanguageContext.tsx
useEffect(() => {
  // Guardar idioma en localStorage
  localStorage.setItem('language', language);
}, [language]);

// Al cargar:
const saved = localStorage.getItem('language');
// Si existe → usar
// Si no existe → detectar idioma del navegador
// Si tampoco → usar español por defecto
```

### **2. Detección Automática de Idioma**

```javascript
// Detectar idioma del navegador
const browserLang = navigator.language.split('-')[0];  // 'es', 'en', etc.

// Si el idioma está soportado → usar
// Si no → usar español como default
const defaultLanguage = ['es', 'en', 'pt', 'ru', 'de', 'fr', 'it', 'zh']
  .includes(browserLang)
  ? browserLang
  : 'es';
```

### **3. Re-render Automático al Cambiar Idioma**

```javascript
// Cuando usuario selecciona idioma:
<select onChange={(e) => setLanguage(e.target.value)}>

// Trigonera:
// 1. setLanguage actualiza estado
// 2. React detecta cambio
// 3. Todos los componentes que usan language() re-renderizan
// 4. getTranslatedDescription() retorna nueva traducción
// 5. UI se actualiza al instante
```

---

## 📊 Vista de Perfil Alternativa

```typescript
if (currentView === 'profile') {
  return (
    <div className="container">
      <header>
        <h1>🏪 {company?.name || 'Tu Resto'}</h1>
        <button onClick={() => setCurrentView('menu')}>
          ← {t('button.backToMenu')}
        </button>
      </header>
      
      <div style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <div style={{
          padding: '2rem',
          borderRadius: '12px',
          background: 'rgba(255, 255, 255, 0.95)',
          color: '#333',
          textAlign: 'center'
        }}>
          <h2>📋 {t('profile.tableInfo')}</h2>
          
          <div style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
            <p>
              <strong>{t('profile.tableNumber')}:</strong> {table?.table_number}
            </p>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              {t('profile.token')}: {table?.qr_token?.substring(0, 8)}...
            </p>
          </div>
          
          <div style={{
            padding: '1.5rem',
            borderRadius: '8px',
            background: '#f0f0f0'
          }}>
            <h3>ℹ️ {t('profile.about')} {company?.name}</h3>
            <p>{t('profile.welcome')}</p>
          </div>
          
          {company?.logo && (
            <div style={{ marginTop: '2rem' }}>
              <img 
                src={`${BASE_URL}${company.logo}`}
                alt={company.name}
                style={{ maxHeight: '100px' }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

---

## 🎯 Resumen del Flujo Completo

```
CLIENTE ESCANEA QR
    ↓
APP.TSX EXTRAE TOKEN
    ↓
VALIDA CONTRA BACKEND
    ↓
CARGA 3 COSAS EN PARALELO:
├─ Menú (GET /api/menu)
├─ Empresa (GET /api/company/settings)
└─ Conecta WebSocket
    ↓
APLICA ESTILOS DINÁMICOS
├─ Colores desde company data
├─ CSS variables
└─ Theme aplicado
    ↓
RENDERIZA UI
├─ Header con logo + mesa
├─ Navegación de categorías
├─ Grid de items
└─ Footer con botón de mesero
    ↓
USUARIO INTERACTÚA
├─ Selecciona categoría → filtra items
├─ Selecciona idioma → traduce todo
├─ Lee descripción → traducida dinámicamente
└─ Llama mesero → POST + WebSocket
    ↓
ADMIN VE SOLICITUD EN TIEMPO REAL
    ↓
SESIÓN COMPLETADA ✅
```

---

**Última actualización:** 9 de diciembre de 2024
