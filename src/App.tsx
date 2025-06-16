import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Dashboard from './pages/Dashboard';
import WomenHealth from './pages/WomenHealth';
import SymptomMoodTracker from './pages/SymptomMoodTracker';
import FertilityTracker from './pages/FertilityTracker';
import HormonalHealthTracker from './pages/HormonalHealthTracker';
import MedicalIntegrations from './pages/MedicalIntegrations';
import Settings from './pages/Settings';
import Gamification from './pages/Gamification';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import HealthData from './pages/HealthData';
import AIHealth from './pages/AIHealth';

function App() {
  return (
    <Router>
      <QueryClientProvider client={new QueryClient()}>
        <AuthProvider>
          <ThemeProvider>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/womens-health" element={<WomenHealth />} />
                <Route path="/symptom-mood-tracker" element={<SymptomMoodTracker />} />
                <Route path="/fertility-tracker" element={<FertilityTracker />} />
                <Route path="/hormonal-health-tracker" element={<HormonalHealthTracker />} />
                <Route path="/medical-integrations" element={<MedicalIntegrations />} />
                <Route path="/health-data" element={<HealthData />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/gamification" element={<Gamification />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/ai-health" element={<AIHealth />} />
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
