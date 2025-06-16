
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from "@/components/ui/toaster"
import Subscription from './pages/Subscription';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import Auth from './pages/Auth';
import RiskAssessment from './pages/RiskAssessment';
import WomensHealth from './pages/WomensHealth';
import HealthAnalytics from './pages/HealthAnalytics';
import Community from './pages/Community';
import Experts from './pages/Experts';
import AIHealth from './pages/AIHealth';
import ExternalIntegrations from './pages/ExternalIntegrations';
import MedicalIntegrations from './pages/MedicalIntegrations';
import TelemedicineIntegrations from './pages/TelemedicineIntegrations';
import EnvironmentalHealth from './pages/EnvironmentalHealth';
import GamificationPage from './pages/GamificationPage';
import ExpertManagement from './pages/ExpertManagement';
import ExpertBlogPage from './pages/ExpertBlogPage';
import ResearchFiles from './pages/ResearchFiles';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/risk-assessment" element={<RiskAssessment />} />
                <Route path="/womens-health" element={<WomensHealth />} />
                <Route path="/health-analytics" element={<HealthAnalytics />} />
                <Route path="/community" element={<Community />} />
                <Route path="/experts" element={<Experts />} />
                <Route path="/ai-health" element={<AIHealth />} />
                <Route path="/external-integrations" element={<ExternalIntegrations />} />
                <Route path="/medical-integrations" element={<MedicalIntegrations />} />
                <Route path="/telemedicine-integrations" element={<TelemedicineIntegrations />} />
                <Route path="/environmental-health" element={<EnvironmentalHealth />} />
                <Route path="/gamification" element={<GamificationPage />} />
                <Route path="/expert-management" element={<ExpertManagement />} />
                <Route path="/expert-blog" element={<ExpertBlogPage />} />
                <Route path="/research-files" element={<ResearchFiles />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
