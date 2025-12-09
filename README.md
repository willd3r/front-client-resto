# Cliente - Digital Bell Menu

Interfaz ligera para que los clientes llamen al mesero desde su mesa.

## Funcionalidad

- 📱 Acceso mediante escaneo de QR
- 🔔 Botón de llamado al mesero
- ✅ Confirmación visual de solicitud
- ⚡ Notificación en tiempo real al backend
- 🎨 Diseño simple y moderno

## Flujo de Usuario

1. Cliente escanea QR de la mesa
2. Se carga la app mostrando el número de mesa
3. Cliente presiona "Llamar Mesero"
4. El botón cambia a "Mesero Notificado"
5. El sistema envía la alerta al panel de administración
6. Después de 30 segundos, el botón se resetea

## Tecnologías

- React
- TypeScript
- Socket.io Client
- Axios
- Vite

## Desarrollo

```bash
npm run dev     # http://localhost:5174
npm run build
npm run preview
```

## URL de Acceso

La URL tendrá este formato:
```
http://localhost:5174?token=abc123-def456-ghi789
```

Donde el `token` es el UUID generado por el backend para cada mesa.

## Configuración

Crea `.env` con:
```
VITE_API_URL=http://localhost:3000/api
VITE_SOCKET_URL=http://localhost:3000
```
