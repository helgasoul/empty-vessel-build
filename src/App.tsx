
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";

// Import pages
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import PatientsPage from "./pages/doctor/PatientsPage";
import SchedulePage from "./pages/doctor/SchedulePage";
import CalculatorsPage from "./pages/doctor/CalculatorsPage";

// Import components
import ProtectedRoute from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Protected routes */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Doctor routes */}
              <Route 
                path="/doctor/patients" 
                element={
                  <ProtectedRoute requireRole="doctor">
                    <PatientsPage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/doctor/schedule" 
                element={
                  <ProtectedRoute requireRole="doctor">
                    <SchedulePage />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/doctor/calculators" 
                element={
                  <ProtectedRoute requireRole="doctor">
                    <CalculatorsPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* Admin only routes */}
              <Route 
                path="/admin/*" 
                element={
                  <ProtectedRoute requireRole="admin">
                    <DashboardPage />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 page */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
