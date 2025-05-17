import { debounce } from 'lodash';
import { toast } from '../hooks/use-toast';
import { TableName, realtimeService } from './realtimeService';

type UpdateCallback = () => void;
type NotificationOptions = {
  notify: boolean;
  message?: string;
  title?: string;
}

/**
 * Centralize subscription management to prevent duplicate updates
 * and provide better control over notification frequency
 */
class SubscriptionManager {
  private subscriptions: Map<string, () => void> = new Map();
  
  /**
   * Subscribe to multiple tables with a single callback
   */
  public subscribe(
    tables: TableName[], 
    callback: UpdateCallback,
    options: NotificationOptions = { notify: true }
  ): () => void {
    // Generate unique key for this subscription set
    const subscriptionKey = tables.sort().join('-');
    
    // If already subscribed to this combination, unsubscribe first
    if (this.subscriptions.has(subscriptionKey)) {
      this.unsubscribe(subscriptionKey);
    }
    
    // Create debounced version of callback to prevent rapid updates
    const debouncedCallback = debounce(() => {
      // Execute the callback
      callback();
      
      // Show notification if enabled
      if (options.notify) {
        toast({
          title: options.title || "Datos actualizados",
          description: options.message || "Los datos han sido actualizados en tiempo real",
        });
      }
    }, 300);
    
    // Subscribe to each table
    const unsubscribeFunctions = tables.map(table => {
      return realtimeService.subscribe(table, {
        onAny: () => debouncedCallback()
      });
    });
    
    // Store unsubscribe function that will clean up all subscriptions
    const unsubscribeAll = () => {
      unsubscribeFunctions.forEach(unsubscribe => unsubscribe());
    };
    
    this.subscriptions.set(subscriptionKey, unsubscribeAll);
    
    // Return function to unsubscribe
    return () => this.unsubscribe(subscriptionKey);
  }
  
  /**
   * Unsubscribe from a specific subscription
   */
  private unsubscribe(subscriptionKey: string): void {
    const unsubscribe = this.subscriptions.get(subscriptionKey);
    if (unsubscribe) {
      unsubscribe();
      this.subscriptions.delete(subscriptionKey);
    }
  }
  
  /**
   * Unsubscribe from all subscriptions
   */
  public unsubscribeAll(): void {
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    this.subscriptions.clear();
  }
}

// Export a singleton instance
export const subscriptionManager = new SubscriptionManager();
