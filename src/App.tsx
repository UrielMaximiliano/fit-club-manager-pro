
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
          
          {/* Rutas protegidas */}
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
          
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
