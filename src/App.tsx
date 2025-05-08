import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import StudentRoutines from "./pages/StudentRoutines";
import RoutineDetail from "./pages/RoutineDetail";
import Dashboard from "./pages/Dashboard";
import Memberships from "./pages/Memberships";
import Payments from "./pages/Payments";
import Attendance from "./pages/Attendance";
import Cashbox from "./pages/Cashbox";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import ProtectedRouteAuth from "./components/ProtectedRouteAuth";
import AdminLayout from "./components/AdminLayout";
import { AuthProvider } from "./contexts/AuthContext";
import ThemeToggle from './components/ThemeToggle';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <header className="w-full flex justify-end items-center p-4 bg-background border-b border-border">
            <ThemeToggle />
          </header>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            
            {/* Ruta inicial después del login */}
            <Route path="/dashboard" element={
              <ProtectedRouteAuth>
                <AdminLayout>
                  <Dashboard />
                </AdminLayout>
              </ProtectedRouteAuth>
            } />
            
            <Route path="/routines" element={
              <ProtectedRouteAuth>
                <AdminLayout>
                  <StudentRoutines />
                </AdminLayout>
              </ProtectedRouteAuth>
            } />
            
            <Route path="/routines/:studentId" element={
              <ProtectedRouteAuth>
                <AdminLayout>
                  <RoutineDetail />
                </AdminLayout>
              </ProtectedRouteAuth>
            } />
            
            <Route path="/members" element={
              <ProtectedRouteAuth>
                <AdminLayout>
                  <StudentRoutines />
                </AdminLayout>
              </ProtectedRouteAuth>
            } />
            
            <Route path="/members/:studentId" element={
              <ProtectedRouteAuth>
                <AdminLayout>
                  <RoutineDetail />
                </AdminLayout>
              </ProtectedRouteAuth>
            } />
            
            {/* Rutas para las funcionalidades implementadas */}
            <Route path="/memberships" element={
              <ProtectedRouteAuth>
                <AdminLayout>
                  <Memberships />
                </AdminLayout>
              </ProtectedRouteAuth>
            } />
            
            <Route path="/payments" element={
              <ProtectedRouteAuth>
                <AdminLayout>
                  <Payments />
                </AdminLayout>
              </ProtectedRouteAuth>
            } />
            
            <Route path="/attendance" element={
              <ProtectedRouteAuth>
                <AdminLayout>
                  <Attendance />
                </AdminLayout>
              </ProtectedRouteAuth>
            } />
            
            <Route path="/cashbox" element={
              <ProtectedRouteAuth>
                <AdminLayout>
                  <Cashbox />
                </AdminLayout>
              </ProtectedRouteAuth>
            } />
            
            <Route path="/reports" element={
              <ProtectedRouteAuth>
                <AdminLayout>
                  <Reports />
                </AdminLayout>
              </ProtectedRouteAuth>
            } />
            
            <Route path="/settings" element={
              <ProtectedRouteAuth>
                <AdminLayout>
                  <Settings />
                </AdminLayout>
              </ProtectedRouteAuth>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
