import { supabase } from '../lib/supabase';
import { realtimeService, TableName } from './realtimeService';

// Mapa para almacenar listeners por tipo de tabla
const listeners = new Map<TableName, Set<any>>();

// Función para notificar a los listeners cuando hay cambios
export const notifyListeners = async (tableName: TableName, getDataFn: () => Promise<any[]>) => {
  const listenerSet = listeners.get(tableName);
  if (!listenerSet || listenerSet.size === 0) return;

  try {
    // Recuperar datos actualizados
    const data = await getDataFn();

    // Notificar a todos los listeners
    listenerSet.forEach(listener => listener(data));
  } catch (error) {
    console.error(`Error al recuperar datos actualizados de ${tableName}:`, error);
  }
};

// Base service class with common functionality
export class BaseService<T> {
  protected tableName: TableName;

  constructor(tableName: TableName) {
    this.tableName = tableName;
  }

  // Register a listener for changes
  onDataChange(listener: (data: T[]) => void) {
    let listenerSet = listeners.get(this.tableName);
    if (!listenerSet) {
      listenerSet = new Set();
      listeners.set(this.tableName, listenerSet);
    }
    listenerSet.add(listener);
    
    // Return function to remove the listener
    return () => {
      const set = listeners.get(this.tableName);
      if (set) set.delete(listener);
    };
  }
}

// Configuración de suscripciones en tiempo real para cada tabla
export const setupRealtimeSubscriptions = () => {
  const tables: TableName[] = ['members', 'memberships', 'payments', 'attendance'];
  
  tables.forEach(table => {
    realtimeService.subscribe(table, {
      onAny: () => {
        // This will be called by each service's getAll function
      }
    });
  });
};

// Start subscriptions
setupRealtimeSubscriptions();

export { supabase };
