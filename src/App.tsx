
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { AppLoader } from "@/components/AppLoader";
import { useAuth } from "@/contexts/AuthContext";

// Import pages
import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import NotFound from "./pages/NotFound";
import PatientsPage from "./pages/doctor/PatientsPage";
import SchedulePage from "./pages/doctor/SchedulePage";
import CalculatorsPage from "./pages/doctor/CalculatorsPage";
import PatientDetailPage from "./pages/doctor/PatientDetailPage";
import RoleSwitchPage from "./pages/RoleSwitchPage";

// Import calculator pages
import FT3FT4Calculator from "./pages/calculators/FT3FT4Calculator";
import HOMAIRCalculator from "./pages/calculators/HOMAIRCalculator";
import FAICalculator from "./pages/calculators/FAICalculator";
import NLRCalculator from "./pages/calculators/NLRCalculator";
import TSHFT4Calculator from "./pages/calculators/TSHFT4Calculator";
import TGHDLCalculator from "./pages/calculators/TGHDLCalculator";

// Import components
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AuthRedirect from "./components/auth/AuthRedirect";

const queryClient = new QueryClient();

function AppContent() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <AppLoader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        {/* Главная страница - лендинг */}
        <Route 
          path="/" 
          element={
            <AuthRedirect>
              <LandingPage />
            </AuthRedirect>
          } 
        />
        
        {/* Аутентификация */}
        <Route 
          path="/login" 
          element={
            <AuthRedirect>
              <LoginPage />
            </AuthRedirect>
          } 
        />
        <Route 
          path="/register" 
          element={
            <AuthRedirect>
              <RegisterPage />
            </AuthRedirect>
          } 
        />
        <Route 
          path="/auth" 
          element={
            <AuthRedirect>
              <Auth />
            </AuthRedirect>
          } 
        />
        
        {/* Защищенные маршруты */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Смена роли */}
        <Route 
          path="/role-switch" 
          element={
            <ProtectedRoute>
              <RoleSwitchPage />
            </ProtectedRoute>
          } 
        />
        
        {/* Врачебные маршруты */}
        <Route 
          path="/doctor/patients" 
          element={
            <ProtectedRoute requireRole="doctor">
              <PatientsPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/doctor/patient/:patientId" 
          element={
            <ProtectedRoute requireRole="doctor">
              <PatientDetailPage />
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
        
        {/* Калькуляторы */}
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
        
        {/* Админ маршруты */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute requireRole="admin">
              <DashboardPage />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 - редирект на главную */}
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
      <Sonner />
    </div>
  );
}

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="ui-theme">
        <TooltipProvider>
          <BrowserRouter>
            <AuthProvider>
              <AppContent />
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
