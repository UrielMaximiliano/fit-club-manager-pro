
import { useEffect, useCallback, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';
import { debounce } from 'lodash';

type TableNames = 'members' | 'memberships' | 'payments' | 'attendance' | 'cashbox';

type DashboardUpdateListeners = {
  onMembersUpdate?: () => void;
  onMembershipsUpdate?: () => void;
  onPaymentsUpdate?: () => void;
  onAttendanceUpdate?: () => void;
  onCashboxUpdate?: () => void;
};

/**
 * Custom hook to handle real-time Supabase subscriptions for dashboard data
 * 
 * @param listeners Object containing callback functions to handle updates for different tables
 * @param debounceMs Optional debounce time in milliseconds (default: 300ms)
 * @param enableToast Whether to show toast notifications on updates (default: true)
 */
export const useRealtimeDashboard = (
  listeners: DashboardUpdateListeners,
  debounceMs = 300,
  enableToast = true
) => {
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // Create debounced notification function to avoid multiple toasts
  const notifyUpdate = useCallback(
    debounce((table: string) => {
      if (enableToast) {
        toast({
          title: "Datos actualizados",
          description: `Los datos de ${table} han sido actualizados en tiempo real`,
        });
      }
      setLastUpdated(new Date());
    }, debounceMs),
    [enableToast, debounceMs]
  );

  // Set up real-time subscriptions
  useEffect(() => {
    // Create array of tables to subscribe to based on provided listeners
    const tablesToSubscribe: TableNames[] = [];
    if (listeners.onMembersUpdate) tablesToSubscribe.push('members');
    if (listeners.onMembershipsUpdate) tablesToSubscribe.push('memberships');
    if (listeners.onPaymentsUpdate) tablesToSubscribe.push('payments');
    if (listeners.onAttendanceUpdate) tablesToSubscribe.push('attendance');
    if (listeners.onCashboxUpdate) tablesToSubscribe.push('cashbox');

    // No tables to subscribe to
    if (tablesToSubscribe.length === 0) return;

    const channels = tablesToSubscribe.map(table => {
      // Create a channel for each table
      const channel = supabase
        .channel(`public:${table}`)
        .on('postgres_changes', 
          { 
            event: '*',  // Listen to all events (INSERT, UPDATE, DELETE)
            schema: 'public', 
            table 
          }, 
          payload => {
            // Call appropriate listener based on table
            switch (table) {
              case 'members':
                if (listeners.onMembersUpdate) listeners.onMembersUpdate();
                break;
              case 'memberships':
                if (listeners.onMembershipsUpdate) listeners.onMembershipsUpdate();
                break;
              case 'payments':
                if (listeners.onPaymentsUpdate) listeners.onPaymentsUpdate();
                break;
              case 'attendance':
                if (listeners.onAttendanceUpdate) listeners.onAttendanceUpdate();
                break;
              case 'cashbox':
                if (listeners.onCashboxUpdate) listeners.onCashboxUpdate();
                break;
            }
            
            // Notify of update
            notifyUpdate(table);
          }
        )
        .subscribe();
        
      return channel;
    });

    // Cleanup function to remove all subscriptions
    return () => {
      channels.forEach(channel => {
        supabase.removeChannel(channel);
      });
    };
  }, [
    listeners.onMembersUpdate, 
    listeners.onMembershipsUpdate, 
    listeners.onPaymentsUpdate, 
    listeners.onAttendanceUpdate,
    listeners.onCashboxUpdate,
    notifyUpdate
  ]);

  // Poll for updates as a fallback to real-time subscriptions
  useEffect(() => {
    // No listeners, no polling
    if (
      !listeners.onMembersUpdate && 
      !listeners.onMembershipsUpdate && 
      !listeners.onPaymentsUpdate && 
      !listeners.onAttendanceUpdate &&
      !listeners.onCashboxUpdate
    ) {
      return;
    }

    // Set up polling interval (30 seconds)
    const interval = setInterval(() => {
      if (listeners.onMembersUpdate) listeners.onMembersUpdate();
      if (listeners.onMembershipsUpdate) listeners.onMembershipsUpdate();
      if (listeners.onPaymentsUpdate) listeners.onPaymentsUpdate();
      if (listeners.onAttendanceUpdate) listeners.onAttendanceUpdate();
      if (listeners.onCashboxUpdate) listeners.onCashboxUpdate();
      
      setLastUpdated(new Date());
    }, 30000); // 30 seconds

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [
    listeners.onMembersUpdate,
    listeners.onMembershipsUpdate,
    listeners.onPaymentsUpdate,
    listeners.onAttendanceUpdate,
    listeners.onCashboxUpdate
  ]);

  // Manual refresh function
  const refreshDashboard = useCallback(() => {
    setLoading(true);
    
    try {
      if (listeners.onMembersUpdate) listeners.onMembersUpdate();
      if (listeners.onMembershipsUpdate) listeners.onMembershipsUpdate();
      if (listeners.onPaymentsUpdate) listeners.onPaymentsUpdate();
      if (listeners.onAttendanceUpdate) listeners.onAttendanceUpdate();
      if (listeners.onCashboxUpdate) listeners.onCashboxUpdate();
      
      setLastUpdated(new Date());
      
      if (enableToast) {
        toast({
          title: "Dashboard actualizado",
          description: "Todos los datos han sido actualizados manualmente",
        });
      }
    } catch (error) {
      console.error("Error refreshing dashboard:", error);
      if (enableToast) {
        toast({
          title: "Error",
          description: "No se pudieron actualizar los datos",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  }, [
    listeners.onMembersUpdate,
    listeners.onMembershipsUpdate,
    listeners.onPaymentsUpdate,
    listeners.onAttendanceUpdate,
    listeners.onCashboxUpdate,
    enableToast
  ]);

  return {
    loading,
    lastUpdated,
    refreshDashboard
  };
};
