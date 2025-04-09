
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1A1F2C]">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-blue-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">Página no encontrada</h2>
        <p className="text-gray-400 mb-8">Lo sentimos, la página que estás buscando no existe.</p>
        <Button asChild variant="default" className="bg-blue-600 hover:bg-blue-700">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" /> Volver al inicio
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
