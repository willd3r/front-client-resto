# 📊 Resumen Completo de la Estructura del Cliente

## 🎯 Visión General

Tu aplicación cliente es una **SPA (Single Page Application)** construida con React que se accede mediante un código QR. Es la interfaz que ven los clientes del restaurante para visualizar el menú y solicitar servicios.

---

## 🏗️ Arquitectura Técnica

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENTE (Vercel)                     │
│  https://front-client-resto.vercel.app?token=xxx       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ App.tsx (Componente Principal)                   │  │
│  │ ├─ useEffect: Autenticación (token QR)          │  │
│  │ ├─ useEffect: Carga menú + empresa              │  │
│  │ ├─ useEffect: Conexión WebSocket                │  │
│  │ └─ State: table, menu, language, socket...      │  │
│  └──────────────────────────────────────────────────┘  │
│           │                    │               │        │
│           ▼                    ▼               ▼        │
│  ┌────────────────┐  ┌───────────────┐  ┌──────────┐  │
│  │LanguageContext│  │CompanyContext │  │Services  │  │
│  │ ├─ language   │  │ ├─ name       │  │ ├─ API   │  │
│  │ ├─ setLang    │  │ ├─ colors     │  │ └─Socket │  │
│  │ └─ t()        │  │ └─ images     │  └──────────┘  │
│  └────────────────┘  └───────────────┘                 │
│           │                    │               │        │
│           ▼                    ▼               ▼        │
│  ┌────────────────┐  ┌───────────────┐  ┌──────────┐  │
│  │ translations   │  │ descriptionTr │  │ imageGen │  │
│  │ (8 idiomas)    │  │ (8 idiomas)   │  │ (fallback│  │
│  └────────────────┘  └───────────────┘  │ images)  │  │
│                                          └──────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │ UI Components                                    │  │
│  │ ├─ Header (logo + titulo + idioma)              │  │
│  │ ├─ Categorías (Todos/Entradas/Principales...)  │  │
│  │ ├─ Menu Grid (items con imagen + descripción)  │  │
│  │ ├─ Profile View (info de mesa)                 │  │
│  │ └─ Footer (Llamar Mesero button)               │  │
│  └──────────────────────────────────────────────────┘  │
│                                                        │
└─────────────────────────────────────────────────────────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
        ▼                ▼                ▼
   ┌─────────┐      ┌─────────┐      ┌─────────┐
   │ API Req │      │ WebSocket│      │ Storage │
   │(Axios)  │      │(socket.io)      │ (localStorage)
   └─────────┘      └─────────┘      └─────────┘
        │                │                │
        └────────────────┼────────────────┘
                         │
        ┌────────────────┴────────────────┐
        │                                  │
        ▼                                  ▼
    ┌──────────────────────────────────────────┐
    │   BACKEND (Railway)                      │
    │   back-resto-production.up.railway.app   │
    └──────────────────────────────────────────┘
            │           │           │
            ▼           ▼           ▼
        ┌────────┐  ┌────────┐  ┌────────┐
        │ /api   │  │ WebSocket   │ /uploads
        │endpoints   │Real-time│  │Images
        └────────┘  └────────┘  └────────┘
            │           │           │
            └───────────┼───────────┘
                        │
                        ▼
            ┌──────────────────────────┐
            │  SUPABASE DATABASE       │
            │  (PostgreSQL)            │
            │  - tables                │
            │  - menu_items            │
            │  - service_requests      │
            │  - companies             │
            └──────────────────────────┘
```

---

## 📂 Estructura de Carpetas Detallada

```
frontend/client/src/
│
├── App.tsx ⭐ COMPONENTE PRINCIPAL
│   └─ Responsable de:
│      • Autenticación mediante token QR
│      • Carga del menú y datos de empresa
│      • Gestión de idioma
│      • Conexión WebSocket
│      • Renderizado de vistas
│
├── App.css
│   └─ Estilos CSS (light theme)
│      • Variables de colores
│      • Layout grid
│      • Animaciones
│
├── context/
│   ├── LanguageContext.tsx 🌐
│   │   ├─ useLanguage() hook
│   │   ├─ useState(language)
│   │   ├─ localStorage.getItem('language')
│   │   └─ 8 idiomas soportados
│   │
│   ├── CompanyContext.tsx 🏢
│   │   ├─ useCompany() hook
│   │   ├─ Datos de restaurante
│   │   ├─ Cargas vía API
│   │   └─ Actualizaciones WebSocket
│   │
│   ├── CompanyContextConfig.tsx
│   │   └─ Definición del context (no editar)
│   │
│   └── useCompany.ts
│       └─ Hook para acceder a company data
│
├── services/
│   ├── api.ts
│   │   └─ Cliente HTTP (axios)
│   │      • Instancia configurada
│   │      • Base URL dinámica
│   │      • Error handling
│   │
│   └── socket.ts
│       └─ Cliente WebSocket (socket.io-client)
│          • Emisores de eventos
│          • Listeners de eventos
│
├── utils/
│   ├── translations.ts 🌍 (8 IDIOMAS)
│   │   ├─ Spanish (es)
│   │   ├─ English (en)
│   │   ├─ Portuguese (pt)
│   │   ├─ Russian (ru)
│   │   ├─ German (de)
│   │   ├─ French (fr)
│   │   ├─ Italian (it)
│   │   ├─ Chinese (zh)
│   │   └─ 25+ keys por idioma
│   │      • header, category, menu, button, error, profile
│   │
│   ├── descriptionTranslations.ts 📝 (DESCRIPCIONES)
│   │   ├─ getTranslatedDescription(desc, lang)
│   │   └─ Traducciones de items del menú
│   │      • Pollo Asado
│   │      • Ensalada
│   │      • Pasta
│   │      • Ceviche
│   │      • etc.
│   │
│   └── imageGenerator.ts 🖼️
│       └─ getMenuItemImage(name, category)
│          • Genera imágenes placeholder
│          • Fallback si imagen falla
│          • 4 categorías
│
├── types/
│   └── index.ts
│       ├─ Table { id, table_number, qr_token }
│       ├─ MenuItem { id, name, price, category, image_url }
│       ├─ Company { name, logo, colors }
│       └─ ServiceRequest
│
├── components/
│   └── Toast.tsx
│       └─ Notificaciones (no usado actualmente)
│
├── pages/
│   ├── Menu.tsx (NO USADO - lógica en App.tsx)
│   ├── Shifts.tsx
│   ├── Waiters.tsx
│   ├── Tables.tsx
│   ├── Dashboard.tsx
│   ├── Analytics.tsx
│   └── Login.tsx
│
├── assets/
│   └─ Imágenes estáticas
│
├── main.tsx
│   └─ Entry point
│      • Monta App en #root
│      • Providers: CompanyProvider, LanguageProvider
│
└── index.css
    └─ Estilos globales
```

---

## 🔄 Flujo de Datos Paso a Paso

### **1. CLIENTE ACCEDE A LA APLICACIÓN**

```
Usuario escanea QR → 
https://front-client-resto.vercel.app?token=abc123xyz
```

**App.tsx línea 60:**
```typescript
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
```

---

### **2. AUTENTICACIÓN DEL TOKEN**

**App.tsx línea 97-104:**
```typescript
const loadTable = async (token: string) => {
  try {
    const response = await axios.get(`${API_URL}/tables/token/${token}`);
    // ${API_URL} = https://back-resto-production.up.railway.app/api
    setTable(response.data);
  } catch (err) {
    setError(t('error.tableNotFound'));
  }
};
```

**Respuesta del backend:**
```json
{
  "id": "uuid",
  "table_number": 5,
  "qr_token": "abc123xyz",
  "created_at": "2024-12-09T10:00:00Z"
}
```

---

### **3. CARGA DE MENÚ**

**App.tsx línea 109-115:**
```typescript
const loadMenu = async () => {
  try {
    const response = await axios.get(`${API_URL}/menu`);
    setMenuItems(response.data); // Array de items
  } catch (err) {
    console.error('Error loading menu:', err);
  }
};
```

**Respuesta del backend:**
```json
[
  {
    "id": "uuid-1",
    "name": "Pollo Asado",
    "description": "Pollo a la parrilla con especias",
    "price": 12.50,
    "category": "principales",
    "image_url": "/uploads/menu/pollo.png",
    "is_available": true
  },
  {
    "id": "uuid-2",
    "name": "Ensalada César",
    "description": "Con lechuga romana y queso parmesano",
    "price": 8.50,
    "category": "entradas",
    "image_url": "/uploads/menu/ensalada.png",
    "is_available": true
  }
]
```

---

### **4. CARGA DE DATOS DE EMPRESA**

**CompanyContext.tsx línea 36-42:**
```typescript
const response = await api.get('/company/settings');
const companyData = response.data.company;
// Datos: name, logo, menu_logo, colors, background_image, theme
```

---

### **5. CONEXIÓN WEBSOCKET**

**App.tsx línea 78-92:**
```typescript
const newSocket = io(SOCKET_URL, {
  transports: ['websocket'],
});
newSocket.on('connect', () => {
  console.log('Connected to server');
  newSocket.emit('client:connect', { tableId: table.id });
});
```

---

### **6. RENDERIZADO DEL MENÚ**

**App.tsx línea 235-333:**

```
┌─────────────────────────────────┐
│         HEADER                   │
│   [LOGO] Nombre Mesa 5  [ES ▼]  │
├─────────────────────────────────┤
│ [Todos] [Entradas] [Principales]│ [Selector idioma]
├─────────────────────────────────┤
│ ┌──────────────┐ ┌────────────┐ │
│ │   [IMAGEN]   │ │ [IMAGEN]   │ │
│ │  Pollo Asado │ │ Ensalada   │ │
│ │ Pollo a la   │ │ Con lechuga│ │
│ │ parrilla ... │ │ romana ... │ │
│ │  $12.50      │ │  $8.50     │ │
│ └──────────────┘ └────────────┘ │
├─────────────────────────────────┤
│  [🔔 Llamar Mesero] STICKY      │
└─────────────────────────────────┘
```

**Código relevante:**
```typescript
// Filtrar por categoría
const filteredItems = activeCategory === 'all'
  ? menuItems
  : menuItems.filter(item => item.category === activeCategory);

// Renderizar items
{filteredItems.map(item => (
  <div key={item.id} className="menu-item-card">
    {/* Imagen con fallback */}
    <img 
      src={item.image_url?.startsWith('http') 
        ? item.image_url 
        : `${BASE_URL}${item.image_url}`}
      onError={(e) => {
        (e.target as HTMLImageElement).src = 
          getMenuItemImage(item.name, item.category);
      }}
    />
    {/* Descripción traducida */}
    <p>{getTranslatedDescription(item.description, language)}</p>
  </div>
))}
```

---

### **7. CAMBIO DE IDIOMA**

**LanguageContext.tsx:**
```typescript
const { language, setLanguage } = useLanguage();

// Selector en App.tsx línea 272-283
<select value={language} onChange={(e) => setLanguage(e.target.value as any)}>
  {Object.entries(LANGUAGES).map(([lang, { name, flag }]) => (
    <option key={lang} value={lang}>
      {flag} {name}
    </option>
  ))}
</select>

// setLanguage automáticamente:
// 1. Actualiza localStorage
// 2. Re-renders componentes con useLanguage()
// 3. Descripciones se traducen en tiempo real
```

---

### **8. LLAMADA DE MESERO**

**App.tsx línea 125-144:**
```typescript
const handleCallWaiter = async () => {
  try {
    // API request
    const response = await axios.post(`${API_URL}/requests`, {
      table_id: table.id,
    });
    
    // WebSocket emit
    socket.emit('client:call_waiter', {
      tableId: table.id,
      tableNumber: table.table_number,
      requestId: response.data.id,
    });
    
    setCalled(true);
    // Reset después de 30 segundos
    setTimeout(() => setCalled(false), 30000);
  } catch (err) {
    setError(err.response?.data?.error || 'Error');
  }
};
```

---

## 🎨 Temas de Color

### **Variables CSS disponibles:**
```css
--gradient-primary      (primary_color)
--gradient-secondary    (secondary_color)
--accent-purple         (primary_color)
--accent-blue           (secondary_color)
--accent-green          (button_color)
--bg-primary
--bg-secondary
--text-primary
--text-secondary
--border-color
```

### **Aplicación de colores (CompanyContext.tsx):**
```typescript
root.style.setProperty('--accent-purple', companyData.primary_color);
root.style.setProperty('--accent-blue', companyData.secondary_color);
```

---

## 📡 API Endpoints Utilizados

| Endpoint | Método | Propósito | Parámetro | Respuesta |
|----------|--------|-----------|-----------|-----------|
| `/tables/token/{token}` | GET | Validar token QR | `token` | `{ id, table_number, qr_token }` |
| `/menu` | GET | Obtener menú | - | `[{ id, name, price, category, image_url, ... }]` |
| `/company/settings` | GET | Obtener datos empresa | - | `{ company: { name, logo, colors, ... } }` |
| `/requests` | POST | Llamar mesero | `{ table_id }` | `{ id, status, ... }` |

---

## 🌐 Variables de Entorno (Vercel)

```env
VITE_API_URL = https://back-resto-production.up.railway.app/api
VITE_SOCKET_URL = https://back-resto-production.up.railway.app
```

**Uso en código:**
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
const BASE_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
```

---

## 🔐 Seguridad y Validaciones

### **Cliente:**
- ✅ Token extraído de URL y validado contra backend
- ✅ Sin credenciales en localStorage (estado en memoria)
- ✅ HTTPS obligatorio en producción
- ✅ CORS configurado en backend

### **Servidor:**
- ✅ Token válido en tabla `tables`
- ✅ Endpoints de menú públicos (lectura)
- ✅ Endpoints de requests validados (requieren token válido)
- ✅ WebSocket autenticado

---

## 📊 Estados Principales (App.tsx)

```typescript
const [table, setTable] = useState<Table | null>(null);
// Datos de la mesa actual (mesa_number, token)

const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
// Array de items disponibles

const [activeCategory, setActiveCategory] = useState('all');
// Categoría seleccionada (all/entradas/principales/bebidas/postres)

const [language, setLanguage] = useState('es');
// Idioma actual (persistido en localStorage)

const [socket, setSocket] = useState<Socket | null>(null);
// Conexión WebSocket activa

const [called, setCalled] = useState(false);
// Si se presionó el botón de llamar mesero

const [error, setError] = useState('');
// Mensaje de error (ej: token inválido)

const [loading, setLoading] = useState(true);
// Mientras carga datos iniciales

const [currentView, setCurrentView] = useState('menu');
// Vista actual (menu / profile)
```

---

## ✨ Features Completadas

- ✅ Autenticación por QR token
- ✅ Carga dinámica del menú
- ✅ Filtrado por categorías
- ✅ Soporte para 8 idiomas
- ✅ Traducciones dinámicas de descripciones
- ✅ Imágenes del restaurante (logo, background)
- ✅ Imágenes de items con fallback
- ✅ Temas dinámicos por color
- ✅ Llamada de mesero en tiempo real
- ✅ WebSocket para notificaciones
- ✅ localStorage para preferencias
- ✅ Responsive design
- ✅ Selector de idioma visual

---

## 🚀 Deployment Status

**Plataforma:** Vercel
**Branch:** main
**URL:** https://front-client-resto.vercel.app

**Auto-deploy:** Si, en cada push a main
**Build Command:** `npm run build`
**Build Output:** `dist/`

---

## ✅ Checklist de Función Completo

- [x] Token QR válido → autentica
- [x] Menú se carga y muestra
- [x] Imágenes cargan desde Railway
- [x] Selector de idioma funciona
- [x] Descripciones se traducen
- [x] Datos de empresa cargan
- [x] WebSocket conecta
- [x] Botón de mesero funciona
- [x] localStorage persiste idioma
- [x] Filtro por categoría funciona
- [x] Responsive en móvil
- [x] Colores personalizados cargan

