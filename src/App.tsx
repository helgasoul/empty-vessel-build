
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import About from "./pages/About";
import Auth from "./pages/Auth";
import RiskAssessment from "./pages/RiskAssessment";
import WomensHealth from "./pages/WomensHealth";
import HealthAnalytics from "./pages/HealthAnalytics";
import MedicalIntegrations from "./pages/MedicalIntegrations";
import TelemedicineIntegrations from "./pages/TelemedicineIntegrations";
import TelemedicineSettings from "./pages/TelemedicineSettings";
import ExternalIntegrations from "./pages/ExternalIntegrations";
import EnvironmentalHealth from "./pages/EnvironmentalHealth";
import AIHealth from "./pages/AIHealth";
import Community from "./pages/Community";
import Experts from "./pages/Experts";
import ExpertBlogPage from "./pages/ExpertBlogPage";
import ExpertManagement from "./pages/ExpertManagement";
import AdminDashboard from "./pages/AdminDashboard";
import Subscription from "./pages/Subscription";
import GamificationPage from "./pages/GamificationPage";
import ResearchFiles from "./pages/ResearchFiles";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function App() {
  return (
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
              <Route path="/about" element={<About />} />
              <Route path="/risk-assessment" element={<RiskAssessment />} />
              <Route path="/womens-health" element={<WomensHealth />} />
              <Route path="/health-analytics" element={<HealthAnalytics />} />
              <Route path="/medical-integrations" element={<MedicalIntegrations />} />
              <Route path="/telemedicine-integrations" element={<TelemedicineIntegrations />} />
              <Route path="/telemedicine-settings" element={<TelemedicineSettings />} />
              <Route path="/external-integrations" element={<ExternalIntegrations />} />
              <Route path="/environmental-health" element={<EnvironmentalHealth />} />
              <Route path="/ai-health" element={<AIHealth />} />
              <Route path="/community" element={<Community />} />
              <Route path="/experts" element={<Experts />} />
              <Route path="/expert-blog" element={<ExpertBlogPage />} />
              <Route path="/expert-management" element={<ExpertManagement />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/gamification" element={<GamificationPage />} />
              <Route path="/research-files" element={<ResearchFiles />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
