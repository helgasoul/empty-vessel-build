
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './pages/Dashboard';
import WomensHealth from './pages/WomensHealth';
import EnvironmentalHealth from './pages/EnvironmentalHealth';
import MedicalIntegrations from './pages/MedicalIntegrations';
import AIHealth from './pages/AIHealth';
import Auth from './pages/Auth';
import TelemedicineIntegrations from './pages/TelemedicineIntegrations';
import HealthAnalytics from './pages/HealthAnalytics';
import GamificationPage from './pages/GamificationPage';

function App() {
  return (
    <Router>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/womens-health" element={<WomensHealth />} />
                <Route path="/environmental-health" element={<EnvironmentalHealth />} />
                <Route path="/medical-integrations" element={<MedicalIntegrations />} />
                <Route path="/telemedicine-integrations" element={<TelemedicineIntegrations />} />
                <Route path="/ai-health" element={<AIHealth />} />
                <Route path="/health-analytics" element={<HealthAnalytics />} />
                <Route path="/gamification" element={<GamificationPage />} />
              </Routes>
              <Toaster />
            </div>
          </ThemeProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
