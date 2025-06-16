import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './components/ThemeProvider';
import { AuthProvider } from './contexts/AuthContext';
import Profile from './pages/Profile';
import RiskAssessmentPage from './pages/RiskAssessmentPage';
import MedicalRecordsPage from './pages/MedicalRecordsPage';
import IntegrationsPage from './pages/IntegrationsPage';
import Founder from './pages/Founder';
import DataExplorer from './pages/DataExplorer';
import { Toaster } from "@/components/ui/toaster"
import LandingPage from './pages/LandingPage';
import ExternalServicesIntegration from './components/integrations/ExternalServicesIntegration';
import NutritionPage from './pages/NutritionPage';
import Subscription from './pages/Subscription';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
          <Router>
            <div className="min-h-screen bg-background">
              <Toaster />
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
                <Route path="/medical-records" element={<MedicalRecordsPage />} />
                <Route path="/integrations" element={<IntegrationsPage />} />
                <Route path="/external-integrations" element={<ExternalServicesIntegration />} />
                <Route path="/nutrition" element={<NutritionPage />} />
                <Route path="/founder" element={<Founder />} />
                <Route path="/data-explorer" element={<DataExplorer />} />
                <Route path="/subscription" element={<Subscription />} />
              </Routes>
            </div>
          </Router>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
