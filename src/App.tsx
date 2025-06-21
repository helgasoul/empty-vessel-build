
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import RiskAssessment from "./pages/RiskAssessment";
import EnvironmentalHealth from "./pages/EnvironmentalHealth";
import HealthVault from "./pages/HealthVault";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Subscribe from "./pages/Subscribe";
import NotificationsPage from "./pages/NotificationsPage";
import HealthServicesPage from "./pages/HealthServicesPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/risk-assessment" element={<RiskAssessment />} />
            <Route path="/environmental-health" element={<EnvironmentalHealth />} />
            <Route path="/health-vault" element={<HealthVault />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/health-services" element={<HealthServicesPage />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/subscribe" element={<Subscribe />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
