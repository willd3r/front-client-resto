# 🍽️ Arquitectura del Cliente - Front-Client-Resto

## Descripción General

La aplicación cliente es una aplicación React que se accede mediante un código QR. Los clientes escanean el QR generado desde el panel de admin, autenticándose automáticamente y visualizando el menú del restaurante con soporte para 8 idiomas.

---

## 🏗️ Estructura de Carpetas

```
frontend/client/
├── public/
├── src/
│   ├── assets/               # Imágenes estáticas
│   ├── components/           # Componentes reutilizables
│   │   └── Toast.tsx
│   ├── context/              # Context API para estado global
│   │   ├── AuthContext.tsx   # (no usado actualmente)
│   │   ├── CompanyContext.tsx     # Datos de configuración del restaurante
│   │   ├── CompanyContextConfig.tsx
│   │   ├── LanguageContext.tsx    # Gestión de idiomas
│   │   └── useCompany.ts     # Hook para acceder a datos de empresa
│   ├── pages/                # Páginas principales
│   │   ├── Analytics.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Login.tsx
│   │   ├── Menu.tsx          # (NO USADO - lógica está en App.tsx)
│   │   ├── Shifts.tsx
│   │   ├── Tables.tsx
│   │   └── Waiters.tsx
│   ├── services/
│   │   ├── api.ts            # Cliente HTTP con Axios
│   │   └── socket.ts         # Cliente WebSocket (io)
│   ├── types/
│   │   └── index.ts          # Tipos de TypeScript
│   ├── utils/
│   │   ├── imageGenerator.ts # Genera imágenes placeholder para items
│   │   ├── translations.ts   # Datos de traducción (8 idiomas)
│   │   └── descriptionTranslations.ts  # Traducciones de descripción de items
│   ├── App.css               # Estilos CSS
│   ├── App.tsx               # Componente principal (LÓGICA DEL CLIENTE)
│   ├── index.css
│   └── main.tsx              # Entry point
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## 🔄 Flujo de Autenticación

### 1. **Escaneo de QR desde Admin**

El admin crea una mesa desde el dashboard, generando automáticamente:
- Un QR code único
- Un token único (`qr_token`)

**Formato del QR:**
```
https://front-client-resto.vercel.app?token=<QR_TOKEN>
```

### 2. **Cliente Accede mediante URL**

```
URL: https://front-client-resto.vercel.app?token=abc123xyz
```

El cliente `App.tsx` extrae el token de la URL:
```typescript
const params = new URLSearchParams(window.location.search);
const token = params.get('token');
```

### 3. **Validación del Token**

```typescript
// GET /api/tables/token/{token}
const response = await axios.get(`${API_URL}/tables/token/${token}`);
```

**Respuesta esperada:**
```json
{
  "id": "uuid",
  "table_number": 5,
  "qr_token": "abc123xyz",
  "created_at": "2024-12-09T10:00:00Z"
}
```

Si el token es inválido → muestra error y cierra la sesión

---

## 📱 Componentes Principales

### **App.tsx** (COMPONENTE PRINCIPAL)

**Responsabilidades:**
- Autenticación mediante token QR
- Carga del menú
- Filtrado por categorías
- Gestión de idiomas
- Conexión WebSocket con servidor
- Llamada de mesero

**Estados principales:**
```typescript
const [table, setTable] = useState<Table | null>(null);        // Datos de mesa
const [menuItems, setMenuItems] = useState<MenuItem[]>([]);    // Items del menú
const [activeCategory, setActiveCategory] = useState('all');   // Categoría activa
const [language, setLanguage] = useState(localStorage.getItem('language') || 'es');  // Idioma
const [socket, setSocket] = useState<Socket | null>(null);     // Conexión WebSocket
const [called, setCalled] = useState(false);                   // Estado "Llamar mesero"
const [error, setError] = useState('');                        // Mensajes de error
const [loading, setLoading] = useState(true);                  // Estado de carga
const [currentView, setCurrentView] = useState('menu');        // 'menu' o 'profile'
```

**Flujo de carga (useEffect):**
1. Extrae token de URL
2. Valida token contra backend
3. Carga configuración de empresa
4. Carga menú disponible
5. Inicializa conexión WebSocket

---

### **LanguageContext.tsx** (Gestión de Idiomas)

**Idiomas soportados (8):**
- 🇪🇸 Español
- 🇬🇧 Inglés
- 🇵🇹 Portugués
- 🇷🇺 Ruso
- 🇩🇪 Alemán
- 🇫🇷 Francés
- 🇮🇹 Italiano
- 🇨🇳 Chino

**Características:**
- Persistencia en localStorage
- Detección automática del idioma del navegador
- Hook `useLanguage()` para acceder a traducciones

**Uso:**
```typescript
const { language, setLanguage, t } = useLanguage();
// t('category.entradas') → "Entradas"
// t('button.callWaiter') → "Llamar Mesero"
```

---

### **CompanyContext.tsx** (Datos de Configuración)

**Datos de empresa:**
```typescript
interface Company {
    id: string;
    name: string;                  // Nombre del restaurante
    logo: string | null;           // Logo en perfil
    menu_logo: string | null;      // Logo en menú
    background_image: string | null; // Fondo del menú
    primary_color: string;         // Color principal
    secondary_color: string;       // Color secundario
    button_color?: string;         // Color del botón
    theme_name: string;            // Nombre del tema
}
```

**Actualización en tiempo real:**
- Carga inicial mediante API: `GET /api/company/settings`
- Actualizaciones en tiempo real vía WebSocket: `company:updated`

---

## 🎨 Estructura Visual

### **Vistas Principales:**

#### 1. **Vista de Menú** (Defecto)
```
┌─────────────────────────────────────┐
│   [LOGO]                            │
│   Nombre del Restaurante            │
│   Mesa 5                            │
├─────────────────────────────────────┤
│ [Todos] [Entradas] [Principales]... │ [Selector Idioma ▼]
├─────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐   │
│ │   [IMAGEN]   │ │   [IMAGEN]   │   │
│ │ Pollo Asado  │ │ Ensalada     │   │
│ │ Descripción  │ │ Descripción  │   │
│ │ $12.50       │ │ $8.50        │   │
│ └──────────────┘ └──────────────┘   │
│                                      │
├─────────────────────────────────────┤
│ [🔔 Llamar Mesero]  (STICKY FOOTER) │
└─────────────────────────────────────┘
```

#### 2. **Vista de Perfil**
```
┌─────────────────────────────────────┐
│ Nombre del Restaurante [← Volver]   │
├─────────────────────────────────────┤
│   📋 Información de Mesa             │
│   Mesa: 5                           │
│   Token: abc123xyz...               │
│                                      │
│   [Logo del restaurante]            │
└─────────────────────────────────────┘
```

---

## 🔌 Conexión Backend

### **Endpoints API utilizados:**

| Método | Endpoint | Propósito |
|--------|----------|-----------|
| GET | `/api/tables/token/{token}` | Validar token QR |
| GET | `/api/menu` | Obtener menú disponible |
| GET | `/api/company/settings` | Obtener datos de empresa |
| POST | `/api/requests` | Llamar al mesero |

### **WebSocket Events:**

**Cliente → Servidor:**
```typescript
socket.emit('client:connect', { tableId: table.id });
socket.emit('client:call_waiter', {
  tableId: table.id,
  tableNumber: table.table_number,
  requestId: response.data.id
});
```

**Servidor → Cliente:**
```typescript
socket.on('client:request_sent');    // Confirmación de llamada al mesero
socket.on('company:updated');        // Actualización de datos de empresa
```

---

## 🌐 Variables de Entorno (Producción)

```env
VITE_API_URL=https://back-resto-production.up.railway.app/api
VITE_SOCKET_URL=https://back-resto-production.up.railway.app
```

**Valores por defecto (desarrollo):**
```
http://localhost:3000/api
http://localhost:3000
```

---

## 🖼️ Manejo de Imágenes

### **Fuentes de imágenes:**

1. **Logo del restaurante** → `company.logo`
2. **Logo del menú** → `company.menu_logo`
3. **Fondo del menú** → `company.background_image`
4. **Imagen del item** → `item.image_url`
5. **Placeholder/Fallback** → Genera automáticamente con `getMenuItemImage()`

### **Rutas de imágenes (producción):**

```typescript
const BASE_URL = process.env.VITE_SOCKET_URL || 'http://localhost:3000';

// Logo
<img src={`${BASE_URL}${company.logo}`} />

// Item del menú
<img src={item.image_url?.startsWith('http') ? item.image_url : `${BASE_URL}${item.image_url}`} />

// Fallback si falla
onError={(e) => {
  (e.target as HTMLImageElement).src = getMenuItemImage(item.name, item.category);
}}
```

---

## 🔄 Flujo Completo de Datos

```
┌──────────────────────────────────────────────────────────────┐
│ 1. ADMIN CREA MESA                                           │
│    → Backend genera QR con token                             │
│    → QR apunta a: https://front-client-resto.vercel.app     │
│                      ?token=xyz123                           │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. CLIENTE ESCANEA QR                                        │
│    → Navega a URL con token                                 │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. CLIENTE SE AUTENTICA                                      │
│    → GET /api/tables/token/xyz123                           │
│    → Backend valida token                                    │
│    → Retorna datos de mesa                                  │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. CLIENTE CARGA DATOS                                       │
│    → GET /api/menu (menú disponible)                         │
│    → GET /api/company/settings (datos de empresa)           │
│    → WebSocket connect (real-time updates)                  │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. CLIENTE RENDERIZA MENÚ                                    │
│    → Muestra logo + background                               │
│    → Muestra items del menú con imágenes                    │
│    → Selector de idioma (8 opciones)                        │
│    → Botón "Llamar Mesero"                                  │
└────────────────────────┬─────────────────────────────────────┘
                         │
                         ▼
┌──────────────────────────────────────────────────────────────┐
│ 6. CLIENTE LLAMA AL MESERO                                   │
│    → POST /api/requests { table_id }                         │
│    → WebSocket: emit 'client:call_waiter'                   │
│    → Admin ve la solicitud en tiempo real                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 🚀 Deployment

**Plataforma:** Vercel
**URL Producción:** https://front-client-resto.vercel.app

**Pasos de deployment:**
1. Push a `main` branch en GitHub
2. Vercel auto-detecta cambios
3. Construye con `npm run build`
4. Publica en producción

**Verificación:**
- Backend conectado: ✅ Railway
- Variables de entorno: ✅ Configuradas en Vercel
- Imágenes: ✅ Usan BASE_URL

---

## 📋 Checklist de Funcionamiento

- [ ] QR redirige correctamente a cliente
- [ ] Token se valida sin errores
- [ ] Menú se carga y muestra items
- [ ] Idioma cambia dinámicamente
- [ ] Descripciones traducen correctamente
- [ ] Imágenes cargan desde Railway
- [ ] Botón "Llamar Mesero" funciona
- [ ] WebSocket conecta en tiempo real
- [ ] Datos de empresa se actualizan en tiempo real

---

## 🔧 Troubleshooting

### Problema: "Token inválido"
- ✓ Verificar que QR fue generado correctamente
- ✓ Verificar que token en URL no esté vacío
- ✓ Verificar que backend responde en `/api/tables/token/{token}`

### Problema: Imágenes no cargan
- ✓ Verificar que `VITE_SOCKET_URL` está configurado
- ✓ Verificar que BASE_URL es la URL correcta del backend
- ✓ Revisar console del navegador para errores 404

### Problema: Idioma no persiste
- ✓ Verificar que localStorage está habilitado
- ✓ Verificar que LanguageContext está envolviendo la app

### Problema: WebSocket no conecta
- ✓ Verificar que `VITE_SOCKET_URL` apunta al backend correcto
- ✓ Verificar que backend está corriendo
- ✓ Revisar consola para errores de conexión

