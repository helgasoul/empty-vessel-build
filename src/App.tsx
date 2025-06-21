
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

// Import calculator pages
import FT3FT4Calculator from "./pages/calculators/FT3FT4Calculator";
import HOMAIRCalculator from "./pages/calculators/HOMAIRCalculator";
import FAICalculator from "./pages/calculators/FAICalculator";
import NLRCalculator from "./pages/calculators/NLRCalculator";
import TSHFT4Calculator from "./pages/calculators/TSHFT4Calculator";
import TGHDLCalculator from "./pages/calculators/TGHDLCalculator";

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
              
              {/* Calculator routes */}
              <Route 
                path="/doctor/calculators/ft3-ft4-ratio" 
                element={
                  <ProtectedRoute requireRole="doctor">
                    <FT3FT4Calculator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/doctor/calculators/homa-ir" 
                element={
                  <ProtectedRoute requireRole="doctor">
                    <HOMAIRCalculator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/doctor/calculators/fai" 
                element={
                  <ProtectedRoute requireRole="doctor">
                    <FAICalculator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/doctor/calculators/nlr" 
                element={
                  <ProtectedRoute requireRole="doctor">
                    <NLRCalculator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/doctor/calculators/tsh-ft4-ratio" 
                element={
                  <ProtectedRoute requireRole="doctor">
                    <TSHFT4Calculator />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/doctor/calculators/tg-hdl-ratio" 
                element={
                  <ProtectedRoute requireRole="doctor">
                    <TGHDLCalculator />
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
