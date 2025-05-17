import React from 'react';
import { render, screen } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';

function TestComponent() {
  const { user, loading } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="user">{user ? user.email : 'no-user'}</span>
    </div>
  );
}

test('AuthProvider renders and provides context', () => {
  render(
    <AuthProvider>
      <TestComponent />
    </AuthProvider>
  );
  expect(screen.getByTestId('loading')).toBeInTheDocument();
  expect(screen.getByTestId('user')).toBeInTheDocument();
}); 