
import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import RiskAssessment from "./pages/RiskAssessment";
import WomensHealth from "./pages/WomensHealth";
import MedicalIntegrations from "./pages/MedicalIntegrations";
import HealthAnalytics from "./pages/HealthAnalytics";
import EnvironmentalHealth from "./pages/EnvironmentalHealth";
import Community from "./pages/Community";
import Experts from "./pages/Experts";
import ExpertBlogPage from "./pages/ExpertBlogPage";
import ExpertManagement from "./pages/ExpertManagement";
import NotFound from "./pages/NotFound";

// Создаем QueryClient один раз за пределами компонента
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 минут
      gcTime: 1000 * 60 * 10, // 10 минут (renamed from cacheTime)
    },
  },
});

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <TooltipProvider>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/risk-assessment" element={<RiskAssessment />} />
                <Route path="/womens-health" element={<WomensHealth />} />
                <Route path="/medical-integrations" element={<MedicalIntegrations />} />
                <Route path="/health-analytics" element={<HealthAnalytics />} />
                <Route path="/environmental-health" element={<EnvironmentalHealth />} />
                <Route path="/community" element={<Community />} />
                <Route path="/experts" element={<Experts />} />
                <Route path="/experts/manage" element={<ExpertManagement />} />
                <Route path="/experts/:expertId/blog" element={<ExpertBlogPage />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
