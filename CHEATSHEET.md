# 🎯 Cheatsheet - Cliente Rest.io

**Referencia rápida de la estructura, flujo y endpoints del cliente.**

---

## 📍 URLs Importantes

```
PRODUCCIÓN:
├─ Cliente QR: https://front-client-resto.vercel.app?token={QR_TOKEN}
├─ Cliente Directo: https://front-client-resto.vercel.app
├─ Backend: https://back-resto-production.up.railway.app
└─ Admin: https://front-adm-resto.vercel.app

DESARROLLO:
├─ Cliente: http://localhost:5174?token={QR_TOKEN}
├─ Backend: http://localhost:3000
└─ Admin: http://localhost:5173
```

---

## 🔑 Variables de Entorno

### **Vercel (Client)**
```env
VITE_API_URL=https://back-resto-production.up.railway.app/api
VITE_SOCKET_URL=https://back-resto-production.up.railway.app
```

### **Railway (Backend)**
```env
CLIENT_FRONTEND_URL=https://front-client-resto.vercel.app
FRONTEND_URL=https://front-adm-resto.vercel.app
```

---

## 📡 API Endpoints (desde cliente)

```javascript
// Validar token QR
GET /api/tables/token/{token}
→ { id, table_number, qr_token, created_at }

// Obtener menú
GET /api/menu
→ [{ id, name, price, category, image_url, description }]

// Datos de empresa
GET /api/company/settings
→ { company: { name, logo, colors, background_image } }

// Llamar mesero
POST /api/requests
body: { table_id }
→ { id, status, request_time }
```

---

## 🌐 Idiomas Soportados

```javascript
const LANGUAGES = {
  'es': { name: 'Español', flag: '🇪🇸' },
  'en': { name: 'English', flag: '🇬🇧' },
  'pt': { name: 'Português', flag: '🇵🇹' },
  'ru': { name: 'Русский', flag: '🇷🇺' },
  'de': { name: 'Deutsch', flag: '🇩🇪' },
  'fr': { name: 'Français', flag: '🇫🇷' },
  'it': { name: 'Italiano', flag: '🇮🇹' },
  'zh': { name: '中文', flag: '🇨🇳' }
}
```

---

## 🎯 Flujo Principal (App.tsx)

```javascript
// 1. EXTRAE TOKEN DE URL
const token = new URLSearchParams(window.location.search).get('token');

// 2. VALIDA TOKEN
axios.get(`${API_URL}/tables/token/${token}`)
  .then(res => setTable(res.data))

// 3. CARGA MENÚ
axios.get(`${API_URL}/menu`)
  .then(res => setMenuItems(res.data))

// 4. CARGA EMPRESA
axios.get(`${API_URL}/company/settings`)
  .then(res => setCompany(res.data.company))

// 5. CONECTA WEBSOCKET
const socket = io(SOCKET_URL)
socket.emit('client:connect', { tableId: table.id })

// 6. LLAMA MESERO
axios.post(`${API_URL}/requests`, { table_id })
socket.emit('client:call_waiter', { tableId, tableNumber })
```

---

## 🎨 Estructura de Carpetas Rápida

```
src/
├── App.tsx              ⭐ Componente principal
├── App.css              # Estilos
├── context/             # LanguageContext, CompanyContext
├── services/            # api.ts, socket.ts
├── utils/               # translations, descriptionTranslations, imageGenerator
├── types/               # TypeScript interfaces
├── components/          # Toast (no usado)
└── pages/               # (NO USADAS)
```

---

## 🔄 Estados Principales

```typescript
const [table, setTable] = useState<Table | null>(null);
const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
const [activeCategory, setActiveCategory] = useState('all');
const [language, setLanguage] = useState('es');
const [socket, setSocket] = useState<Socket | null>(null);
const [called, setCalled] = useState(false);
const [error, setError] = useState('');
const [loading, setLoading] = useState(true);
const [currentView, setCurrentView] = useState('menu');
```

---

## 🔗 Hooks Personalizados

```typescript
// Usar idioma
const { language, setLanguage, t } = useLanguage();

// Usar datos de empresa
const { company } = useCompany();

// Traducir descripción
const translated = getTranslatedDescription(desc, language);

// Generar imagen fallback
const imgUrl = getMenuItemImage(name, category);
```

---

## 📱 Categorías del Menú

```javascript
const categories = [
  'all',          // Todos
  'entradas',     // Entradas
  'principales',  // Principales
  'bebidas',      // Bebidas
  'postres'       // Postres
];
```

---

## 🌐 WebSocket Events

```javascript
// Cliente → Servidor
socket.emit('client:connect', { tableId })
socket.emit('client:call_waiter', { tableId, tableNumber, requestId })

// Servidor → Cliente
socket.on('client:request_sent', (data) => {})
socket.on('company:updated', (data) => {})
```

---

## 🎨 Temas CSS

```css
/* Variables disponibles */
--gradient-primary        /* Color primario */
--gradient-secondary      /* Color secundario */
--accent-purple           /* Color primario (igual) */
--accent-blue             /* Color secundario (igual) */
--accent-green            /* Color del botón */
--bg-primary              /* Fondo principal */
--bg-secondary            /* Fondo secundario */
--text-primary            /* Texto principal */
--text-secondary          /* Texto secundario */
--border-color            /* Color de borde */

/* Los colores se aplican dinámicamente desde CompanyContext */
root.style.setProperty('--accent-purple', company.primary_color);
root.style.setProperty('--accent-blue', company.secondary_color);
```

---

## 💾 localStorage

```javascript
// Idioma guardado
localStorage.getItem('language')  // 'es', 'en', etc.
localStorage.setItem('language', 'en')
```

---

## 📊 Estructura de Datos

### **Table**
```javascript
{
  id: 'uuid',
  table_number: 5,
  qr_token: 'token-uuid',
  created_at: '2024-12-09T10:00:00Z'
}
```

### **MenuItem**
```javascript
{
  id: 'uuid',
  name: 'Pollo Asado',
  description: 'Pollo a la parrilla con especias',
  price: 12.50,
  category: 'principales',
  image_url: '/uploads/menu/pollo.png',
  is_available: true
}
```

### **Company**
```javascript
{
  id: 'uuid',
  name: 'Mi Restaurante',
  logo: '/uploads/logo/logo.png',
  menu_logo: '/uploads/logo/menu.png',
  background_image: '/uploads/background/bg.jpg',
  primary_color: '#FF5733',
  secondary_color: '#3366FF',
  button_color: '#33FF33',
  theme_name: 'light'
}
```

---

## 🔧 Comandos Útiles

```bash
# Desarrollo
npm run dev           # Inicia servidor (localhost:5174)

# Build
npm run build         # Compila para producción
npm run preview       # Preview del build

# Lint
npm run lint          # Verifica sintaxis

# Git
git add .
git commit -m "mensaje"
git push origin main
```

---

## 🐛 Debugging

```javascript
// Console para verificar estado
console.log('Token:', token);
console.log('Table:', table);
console.log('Language:', language);
console.log('Socket connected:', socket?.connected);

// En navegador (F12)
// Network tab: ver requests a APIs
// Console: ver errores
// Application: ver localStorage

// Verificar URL actual
window.location.href
window.location.search
```

---

## ✅ Checklist de Deploy

- [ ] Código committeado en main branch
- [ ] Build local sin errores: `npm run build`
- [ ] Variables de entorno en Vercel
- [ ] Push a GitHub dispara auto-deploy
- [ ] URL accesible: `front-client-resto.vercel.app`
- [ ] QR funciona y autentica
- [ ] Menú carga correctamente
- [ ] Imágenes cargan desde Railway
- [ ] Idiomas funcionan
- [ ] WebSocket conecta
- [ ] Botón "Llamar Mesero" funciona

---

## 🆘 Troubleshooting Rápido

| Problema | Solución |
|----------|----------|
| Token inválido | Verificar que el QR fue generado, validar token en URL |
| Menú no carga | Verificar `VITE_API_URL`, revisar Network tab en DevTools |
| Imágenes no cargan | Verificar `VITE_SOCKET_URL`, buscar 404 en Network tab |
| WebSocket no conecta | Verificar `VITE_SOCKET_URL`, revisar Backend status en Railway |
| Idioma no cambia | Limpiar localStorage, revisar console para errores |

---

## 📚 Documentación Completa

- `README.md` - Guía general
- `CLIENT_ARCHITECTURE.md` - Arquitectura detallada
- `COMPLETE_CLIENT_STRUCTURE.md` - Estructura paso a paso
- Backend `QR_AND_CLIENT_INTEGRATION.md` - Integración con backend

---

## 🔑 Claves para Recordar

1. **Token es la autenticación** → Validado en cada solicitud
2. **Menú es dinámico** → Cargado desde backend
3. **Idioma persiste** → Guardado en localStorage
4. **WebSocket en tiempo real** → Para notificaciones
5. **Imágenes desde Railway** → `${BASE_URL}/uploads/...`
6. **Colores dinámicos** → Aplicados desde Company data
7. **8 idiomas** → Todos con traducciones completas
8. **Responsive** → Funciona en móvil y desktop

---

**Última actualización:** 9 de diciembre de 2024
