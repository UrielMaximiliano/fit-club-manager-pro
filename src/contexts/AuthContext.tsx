
import React, { createContext, useContext, useState } from "react";
import { User, users } from "../data/mockData";
import { toast } from "sonner";

type AuthContextType = {
  currentUser: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // In a real app, this would validate against a server
  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simple mock validation
    if (password === "password") {
      const user = users.find(u => u.username === username && u.status === "active");
      
      if (user) {
        setCurrentUser(user);
        toast.success(`Bienvenido, ${user.name}!`);
        setIsLoading(false);
        return true;
      }
    }
    
    toast.error("Usuario o contraseña incorrectos");
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    toast.info("Sesión cerrada");
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser utilizado dentro de un AuthProvider");
  }
  return context;
};
