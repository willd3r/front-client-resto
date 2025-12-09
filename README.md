# 🍽️ Cliente - Rest.io Menu Digital

**Aplicación React para visualizar el menú del restaurante y solicitar servicios mediante código QR.**

[![Vercel](https://img.shields.io/badge/Deployed-Vercel-blue)](https://front-client-resto.vercel.app)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61dafb)](https://react.dev)
[![Node](https://img.shields.io/badge/Node-20+-339933)](https://nodejs.org)

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Flujo de Usuario](#flujo-de-usuario)
- [Arquitectura](#arquitectura)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Desarrollo](#desarrollo)
- [Documentación](#documentación)
- [URLs Producción](#urls-producción)

---

## ✨ Características

### **Autenticación**
- ✅ Acceso mediante escaneo de QR único
- ✅ Token validado contra backend
- ✅ Sesión persistente por tabla

### **Menú Interactivo**
- ✅ Carga dinámica desde backend
- ✅ Filtrado por categorías (Entradas, Principales, Bebidas, Postres)
- ✅ Imágenes de items con fallback
- ✅ Información de precios y descripción

### **Multi-Idioma**
- 🌐 **8 idiomas soportados:**
  - 🇪🇸 Español (es)
  - 🇬🇧 Inglés (en)
  - 🇵🇹 Portugués (pt)
  - 🇷🇺 Ruso (ru)
  - 🇩🇪 Alemán (de)
  - 🇫🇷 Francés (fr)
  - 🇮🇹 Italiano (it)
  - 🇨🇳 Chino (zh)
- ✅ Persistencia en localStorage
- ✅ Detección automática del idioma del navegador
- ✅ Traducción dinámica de descripciones

### **Personalización**
- 🎨 Colores dinámicos del restaurante
- 🖼️ Logo y fondo personalizados
- 📱 Responsive design

### **Tiempo Real**
- ⚡ WebSocket para notificaciones
- 🔔 Botón "Llamar Mesero" con confirmación
- 📊 Actualizaciones de datos en tiempo real

---

## 🔄 Flujo de Usuario

```
┌─────────────────────────────────────────────┐
│ 1. CLIENTE ESCANEA QR                       │
│    Admin genera QR en panel                 │
│    Cliente escanea con teléfono             │
│    ↓ Navega a URL con token                 │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ 2. AUTENTICACIÓN                            │
│    Backend valida token                     │
│    Retorna datos de mesa                    │
│    ↓ Cliente se autentica                   │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ 3. CARGA DE MENÚ                            │
│    GET /api/menu                            │
│    GET /api/company/settings                │
│    WebSocket connect                        │
│    ↓ Renderiza UI                           │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ 4. CLIENTE INTERACTÚA                       │
│    Selecciona idioma                        │
│    Filtra por categoría                     │
│    Lee descripción de items                 │
│    ↓ Llama al mesero                        │
└─────────────────────────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────┐
│ 5. SOLICITUD PROCESADA                      │
│    POST /api/requests                       │
│    WebSocket emit 'client:call_waiter'      │
│    ↓ Admin ve solicitud en tiempo real      │
└─────────────────────────────────────────────┘
```

---

## 🏗️ Arquitectura

### **Componente Principal: App.tsx**
- Orquestación general de la aplicación
- Autenticación por token QR
- Carga de datos (menú, empresa, tabla)
- Gestión de estado (idioma, categoría, WebSocket)
- Renderizado de vistas (menú, perfil)

### **Context API**
```
LanguageContext
├─ language: string
├─ setLanguage: (lang) => void
└─ t: (key) => string

CompanyContext
├─ company: Company | null
├─ loading: boolean
└─ refreshCompany: () => Promise<void>
```

### **Servicios**
```
services/api.ts       → Cliente HTTP (axios)
services/socket.ts    → WebSocket (socket.io-client)
```

### **Utilidades**
```
utils/translations.ts           → Datos de traducción (8 idiomas)
utils/descriptionTranslations.ts → Traducciones de items
utils/imageGenerator.ts         → Imágenes placeholder
```

### **Flujo de Datos**
```
URL ?token=xxx
    ↓
App.tsx extrae token
    ↓
Valida contra: GET /api/tables/token/{token}
    ↓
Carga: GET /api/menu + GET /api/company/settings
    ↓
Conecta: WebSocket io(SOCKET_URL)
    ↓
Renderiza: UI con menú, idioma, colores dinámicos
```

---

## 📂 Estructura del Proyecto

```
frontend/client/
├── src/
│   ├── App.tsx                    # Componente principal ⭐
│   ├── App.css                    # Estilos
│   ├── main.tsx                   # Entry point
│   ├── index.css                  # Estilos globales
│   │
│   ├── context/
│   │   ├── LanguageContext.tsx    # Gestión de idiomas 🌐
│   │   ├── CompanyContext.tsx     # Datos de empresa 🏢
│   │   ├── CompanyContextConfig.tsx
│   │   └── useCompany.ts
│   │
│   ├── services/
│   │   ├── api.ts                 # Cliente HTTP
│   │   └── socket.ts              # WebSocket
│   │
│   ├── utils/
│   │   ├── translations.ts        # 8 idiomas 🌍
│   │   ├── descriptionTranslations.ts # Descripción items
│   │   └── imageGenerator.ts      # Imágenes fallback
│   │
│   ├── types/
│   │   └── index.ts               # TypeScript types
│   │
│   ├── components/
│   │   └── Toast.tsx
│   │
│   ├── pages/                     # (NO USADAS - lógica en App.tsx)
│   │
│   └── assets/
│
├── public/
├── vite.config.ts
├── tsconfig.json
├── package.json
├── index.html
│
├── README.md                      # Este archivo
├── CLIENT_ARCHITECTURE.md         # Documentación detallada
└── COMPLETE_CLIENT_STRUCTURE.md   # Estructura completa
```

---

## 🚀 Instalación

### **Requisitos**
- Node.js 20+
- npm o yarn

### **Pasos**

```bash
# 1. Clonar repositorio
git clone https://github.com/willd3r/front-client-resto.git
cd front-client-resto

# 2. Instalar dependencias
npm install

# 3. Crear archivo .env
cp .env.example .env

# 4. Configurar variables (ver sección Configuración)

# 5. Iniciar servidor de desarrollo
npm run dev

# 6. Abrir en navegador
# http://localhost:5174?token=test-token
```

---

## ⚙️ Configuración

### **Variables de Entorno (.env)**

```env
# APIs del Backend
VITE_API_URL=https://back-resto-production.up.railway.app/api
VITE_SOCKET_URL=https://back-resto-production.up.railway.app

# Desarrollo (opcional)
# VITE_API_URL=http://localhost:3000/api
# VITE_SOCKET_URL=http://localhost:3000
```

### **Configuración en Vercel**

```
Dashboard → front-client-resto → Settings → Environment Variables

✅ VITE_API_URL = https://back-resto-production.up.railway.app/api
✅ VITE_SOCKET_URL = https://back-resto-production.up.railway.app
```

---

## 💻 Desarrollo

```bash
# Servidor de desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview

# Linting
npm run lint
```

### **URLs Desarrollo**
```
Cliente: http://localhost:5174
Backend: http://localhost:3000
```

### **Parámetro de Token**
```
http://localhost:5174?token=abc123-def456-ghi789
```

---

## 📱 URLs Producción

| Ambiente | URL |
|----------|-----|
| **Cliente** | https://front-client-resto.vercel.app |
| **Backend** | https://back-resto-production.up.railway.app |
| **QR Format** | https://front-client-resto.vercel.app?token=xxx |

---

## 📚 Documentación

### **Archivos incluidos:**

1. **CLIENT_ARCHITECTURE.md**
   - Arquitectura técnica
   - Estructura de carpetas detallada
   - Flujo de datos
   - API endpoints

2. **COMPLETE_CLIENT_STRUCTURE.md**
   - Visión general completa
   - Código fuente comentado
   - Flujo paso a paso
   - Temas de color y estilos

3. **QR_AND_CLIENT_INTEGRATION.md** (en backend)
   - Generación de QR
   - Integración con cliente
   - Base de datos

---

## 🔧 Troubleshooting

### ❌ "Token inválido"
```
✓ Verificar que el QR fue generado desde admin
✓ Verificar que el token en la URL no está vacío
✓ Verificar que el backend está corriendo
```

### ❌ Imágenes no cargan
```
✓ Verificar VITE_SOCKET_URL está configurado
✓ Revisar console (F12) para errores 404
✓ Verificar que archivos existen en /uploads/
```

### ❌ WebSocket no conecta
```
✓ Verificar VITE_SOCKET_URL es correcto
✓ Verificar que backend está en estado Live
✓ Revisar console para errores de conexión
```

---

## 🔐 Seguridad

- ✅ Token QR validado contra backend
- ✅ Sin almacenamiento de credenciales
- ✅ HTTPS en producción
- ✅ CORS configurado
- ✅ WebSocket asegurado

---

## 📦 Tecnologías

- **React 19** - UI Framework
- **TypeScript 5.7** - Type safety
- **Vite 5** - Build tool
- **Axios** - HTTP client
- **Socket.io-client** - Real-time communication
- **Lucide React** - Icons

---

## 🙋 Soporte

Para más información, consulta:
- `CLIENT_ARCHITECTURE.md` - Documentación técnica
- `COMPLETE_CLIENT_STRUCTURE.md` - Estructura detallada
- Backend `QR_AND_CLIENT_INTEGRATION.md` - Integración QR

---

## 📄 Licencia

Parte del proyecto Rest.io

---

**Última actualización:** 9 de diciembre de 2024  
**Estado:** ✅ Producción
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```
