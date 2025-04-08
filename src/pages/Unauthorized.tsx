
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { Link } from "react-router-dom";

const Unauthorized = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldAlert size={48} className="text-red-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Acceso no autorizado</h1>
        <p className="text-xl text-gray-600 mb-8">No tienes permisos suficientes para acceder a esta sección.</p>
        <Link to="/dashboard">
          <Button className="bg-gym-primary hover:bg-blue-600">
            Volver al Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
