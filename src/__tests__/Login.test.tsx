import React from 'react';
import { render, screen } from '@testing-library/react';
import Login from '../pages/Login';

test('renderiza el formulario de login', () => {
  render(<Login />);
  expect(screen.getByText(/iniciar sesión/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
}); 