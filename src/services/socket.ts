/**
 * ============================================================================
 * CLIENT SOCKET SERVICE - MEJORA PROPUESTA
 * ============================================================================
 * 
 * Este archivo muestra cómo integrar la librería socket-client compartida
 * en la app del cliente (tabla) para mejor organización del código.
 * 
 * UBICACIÓN SUGERIDA: frontend/client/src/services/socket.ts
 */

import {
  initSocket as initSharedSocket,
  getSocket as getSharedSocket,
  disconnectSocket as disconnectSharedSocket,
  connectAsClient,
  callWaiter,
  onWaiterResponse,
  onServiceResolved,
  onCompanyUpdated,
  isSocketConnected,
} from '@@/socket-client';

interface ClientSocketOptions {
  tableId: string;
  token?: string;
}

/**
 * Initialize socket connection for client (table)
 */
export const initializeClientSocket = async (options: ClientSocketOptions) => {
  try {
    await initSharedSocket(options.token);
    connectAsClient(options.tableId);
    console.log(`✅ Connected as table ${options.tableId}`);
    return getSharedSocket();
  } catch (error) {
    console.error('❌ Failed to initialize client socket:', error);
    throw error;
  }
};

/**
 * Get current socket instance
 */
export const getSocket = () => {
  return getSharedSocket();
};

/**
 * Request waiter assistance
 */
export const requestWaiter = (tableId: string, tableNumber: number, requestId: string) => {
  callWaiter(tableId, tableNumber, requestId);
};

/**
 * Listen for waiter response
 */
export const onWaiterArrival = (callback: (data: Record<string, unknown>) => void) => {
  onWaiterResponse((data: Record<string, unknown>) => {
    if (data.success) {
      callback(data);
    }
  });
};

/**
 * Listen for service request resolution
 */
export const onRequestResolution = (callback: (data: Record<string, unknown>) => void) => {
  onServiceResolved(callback);
};

/**
 * Listen for company updates (theme changes, etc)
 */
export const onCompanySettingsChange = (callback: (data: Record<string, unknown>) => void) => {
  onCompanyUpdated(callback);
};

/**
 * Check if socket is connected
 */
export const isConnected = (): boolean => {
  return isSocketConnected();
};

/**
 * Disconnect from socket
 */
export const disconnectClient = () => {
  disconnectSharedSocket();
  console.log('Disconnected from server');
};

/**
 * ============================================================================
 * INTEGRACIÓN EN App.tsx
 * ============================================================================
 * 
 * import { initializeClientSocket, requestWaiter, onWaiterArrival } from './services/socket';
 * 
 * useEffect(() => {
 *   if (!table) return;
 *   
 *   const setupSocket = async () => {
 *     try {
 *       await initializeClientSocket({ 
 *         tableId: table.id,
 *         token: tableToken 
 *       });
 *       
 *       // Escuchar respuesta del mesero
 *       onWaiterArrival((data) => {
 *         setCalled(true);
 *         showToast('¡Mesero en camino!');
 *         setTimeout(() => setCalled(false), 30000);
 *       });
 *       
 *       // Escuchar resolución
 *       onRequestResolution(() => {
 *         showToast('Solicitud completada');
 *       });
 *       
 *     } catch (error) {
 *       console.error('Socket error:', error);
 *     }
 *   };
 *   
 *   setupSocket();
 *   
 *   return () => disconnectClient();
 * }, [table]);
 * 
 * const handleCallWaiter = async () => {
 *   try {
 *     const response = await axios.post(`${API_URL}/requests`, {
 *       table_id: table.id,
 *     });
 *     
 *     requestWaiter(
 *       table.id,
 *       table.table_number,
 *       response.data.id
 *     );
 *   } catch (error) {
 *     showToast('Error al solicitar mesero');
 *   }
 * };
 */

export default {
  initializeClientSocket,
  getSocket,
  requestWaiter,
  onWaiterArrival,
  onRequestResolution,
  onCompanySettingsChange,
  isConnected,
  disconnectClient,
};
