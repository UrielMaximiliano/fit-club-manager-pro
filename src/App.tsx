
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
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/AdminLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          
          {/* Ruta inicial después del login */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <AdminLayout>
                <Dashboard />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/routines" element={
            <ProtectedRoute>
              <AdminLayout>
                <StudentRoutines />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/routines/:studentId" element={
            <ProtectedRoute>
              <AdminLayout>
                <RoutineDetail />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/members" element={
            <ProtectedRoute>
              <AdminLayout>
                <StudentRoutines />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/members/:studentId" element={
            <ProtectedRoute>
              <AdminLayout>
                <RoutineDetail />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* Rutas para las funcionalidades implementadas */}
          <Route path="/memberships" element={
            <ProtectedRoute>
              <AdminLayout>
                <Memberships />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/payments" element={
            <ProtectedRoute>
              <AdminLayout>
                <Payments />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/attendance" element={
            <ProtectedRoute>
              <AdminLayout>
                <Attendance />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/cashbox" element={
            <ProtectedRoute>
              <AdminLayout>
                <Cashbox />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/reports" element={
            <ProtectedRoute>
              <AdminLayout>
                <Reports />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          <Route path="/settings" element={
            <ProtectedRoute>
              <AdminLayout>
                <Settings />
              </AdminLayout>
            </ProtectedRoute>
          } />
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
