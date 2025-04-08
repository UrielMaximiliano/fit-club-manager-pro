
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "../../contexts/AuthContext";
import { 
  LayoutDashboard, 
  Users, 
  CreditCard, 
  BarChart3, 
  Settings, 
  ChevronLeft,
  Dumbbell,
  BadgeDollarSign,
  CalendarDays
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar = ({ isOpen, setIsOpen }: SidebarProps) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  const isAdmin = currentUser?.role === "admin";

  const links = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, show: true },
    { name: "Miembros", href: "/members", icon: Users, show: true },
    { name: "Membresías", href: "/memberships", icon: Dumbbell, show: true },
    { name: "Pagos", href: "/payments", icon: CreditCard, show: true },
    { name: "Asistencias", href: "/access", icon: CalendarDays, show: true },
    { name: "Caja", href: "/cash", icon: BadgeDollarSign, show: true },
    { name: "Reportes", href: "/reports", icon: BarChart3, show: true },
    { name: "Configuración", href: "/settings", icon: Settings, show: isAdmin }
  ];

  return (
    <div className={cn(
      "fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col bg-white transition-all duration-300 ease-in-out border-r",
      isOpen ? "transform-none" : "-translate-x-full md:translate-x-0 md:w-16"
    )}>
      <div className="flex items-center justify-between h-16 px-4 border-b">
        <Link to="/dashboard" className="flex items-center space-x-2">
          <span className="font-bold text-xl text-gym-primary">GIMNASIO</span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hidden md:flex items-center justify-center h-8 w-8 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft className={cn("h-4 w-4 transition-transform", !isOpen && "rotate-180")} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-2">
        <ul className="space-y-1">
          {links.filter(link => link.show).map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={cn(
                  "flex items-center rounded-md px-3 py-2 text-gray-800 hover:bg-gray-100 transition-colors",
                  location.pathname.startsWith(link.href) && "bg-gym-primary text-white hover:bg-gym-primary/90"
                )}
              >
                <link.icon className={cn("h-5 w-5", !isOpen && "mx-auto")} />
                {isOpen && <span className="ml-3 text-sm">{link.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
