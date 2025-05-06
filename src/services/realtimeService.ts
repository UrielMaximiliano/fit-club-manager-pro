
import { RealtimeChannel } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

// Tipos de eventos para notificaciones
export type DataChangeEvent = 'INSERT' | 'UPDATE' | 'DELETE';
export type TableName = 'members' | 'memberships' | 'payments' | 'attendance';

// Interfaz para callbacks de suscripción
export interface SubscriptionCallback {
  onInsert?: (newRecord: any) => void;
  onUpdate?: (oldRecord: any, newRecord: any) => void;
  onDelete?: (oldRecord: any) => void;
  onAny?: (payload: any, eventType: DataChangeEvent) => void;
}

class RealtimeService {
  private channels: Map<string, RealtimeChannel> = new Map();
  private subscriptions: Map<string, SubscriptionCallback[]> = new Map();
  
  // Suscribirse a cambios en una tabla
  subscribe(
    tableName: TableName, 
    callback: SubscriptionCallback, 
    filter?: string
  ): () => void {
    const channelKey = filter ? `${tableName}:${filter}` : tableName;
    
    // Crear o recuperar canal
    if (!this.channels.has(channelKey)) {
      let channel = supabase.channel(`public:${channelKey}`);
      
      // Configurar el canal para la tabla específica
      channel = channel
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: tableName,
          filter
        }, (payload) => {
          this.notifySubscribers(channelKey, 'INSERT', payload);
        })
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: tableName,
          filter
        }, (payload) => {
          this.notifySubscribers(channelKey, 'UPDATE', payload);
        })
        .on('postgres_changes', {
          event: 'DELETE',
          schema: 'public',
          table: tableName,
          filter
        }, (payload) => {
          this.notifySubscribers(channelKey, 'DELETE', payload);
        });

      // Suscribirse al canal
      channel.subscribe((status) => {
        console.log(`Suscripción a ${channelKey}: ${status}`);
      });
      
      this.channels.set(channelKey, channel);
      this.subscriptions.set(channelKey, []);
    }
    
    // Añadir callback a las suscripciones
    const callbacks = this.subscriptions.get(channelKey) || [];
    callbacks.push(callback);
    this.subscriptions.set(channelKey, callbacks);
    
    // Retornar función para cancelar suscripción
    return () => {
      this.unsubscribe(tableName, callback, filter);
    };
  }
  
  // Cancelar una suscripción específica
  unsubscribe(
    tableName: TableName, 
    callback: SubscriptionCallback, 
    filter?: string
  ): void {
    const channelKey = filter ? `${tableName}:${filter}` : tableName;
    const callbacks = this.subscriptions.get(channelKey) || [];
    
    // Encontrar y eliminar el callback
    const index = callbacks.indexOf(callback);
    if (index !== -1) {
      callbacks.splice(index, 1);
    }
    
    // Si no quedan suscripciones, remover el canal
    if (callbacks.length === 0) {
      const channel = this.channels.get(channelKey);
      if (channel) {
        channel.unsubscribe();
        this.channels.delete(channelKey);
      }
      this.subscriptions.delete(channelKey);
    } else {
      this.subscriptions.set(channelKey, callbacks);
    }
  }
  
  // Notificar a todos los suscriptores de un canal
  private notifySubscribers(
    channelKey: string, 
    eventType: DataChangeEvent, 
    payload: any
  ): void {
    const callbacks = this.subscriptions.get(channelKey) || [];
    
    callbacks.forEach(callback => {
      // Notificar según tipo de evento
      switch (eventType) {
        case 'INSERT':
          if (callback.onInsert) callback.onInsert(payload.new);
          break;
        case 'UPDATE':
          if (callback.onUpdate) callback.onUpdate(payload.old, payload.new);
          break;
        case 'DELETE':
          if (callback.onDelete) callback.onDelete(payload.old);
          break;
      }
      
      // Notificar para cualquier evento
      if (callback.onAny) callback.onAny(payload, eventType);
    });
  }
}

// Exportar una sola instancia del servicio para toda la aplicación
export const realtimeService = new RealtimeService();
