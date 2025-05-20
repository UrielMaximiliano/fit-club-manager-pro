// Script para crear usuarios con tenant_id en Supabase
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function crearUsuarioConTenant(email: string, password: string, tenantId: string, isDemo = false) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    app_metadata: { // Changed from user_metadata to app_metadata
      tenant_id: tenantId,
      is_demo: isDemo,
    },
    email_confirm: true,
  });

  if (error) {
    console.error('Error al crear usuario:', error);
  } else {
    console.log('Usuario creado:', data);
  }
}

// Ejemplo de uso:
// Reemplaza estos valores por los que necesites
crearUsuarioConTenant('nuevo@ejemplo.com', 'contraseñaSegura', 'gimnasio1', false); 