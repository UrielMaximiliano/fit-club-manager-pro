import React from 'react';
import { render, screen } from '@testing-library/react';
import ProtectedRouteAuth from '../components/ProtectedRouteAuth';
import { AuthProvider } from '../contexts/AuthContext';

test('ProtectedRouteAuth muestra loader si está cargando', () => {
  render(
    <AuthProvider>
      <ProtectedRouteAuth>
        <div>Contenido protegido</div>
      </ProtectedRouteAuth>
    </AuthProvider>
  );
  expect(screen.getByText(/cargando/i)).toBeInTheDocument();
}); 