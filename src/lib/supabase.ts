
import { createClient } from '@supabase/supabase-js';

// Creamos y exportamos el cliente de Supabase para usarlo en toda la aplicación
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);
