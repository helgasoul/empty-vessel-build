
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import WomensHealth from "./pages/WomensHealth";
import MedicalIntegrations from "./pages/MedicalIntegrations";
import RiskAssessment from "./pages/RiskAssessment";
import MedicalCalendar from "./pages/MedicalCalendar";
import MedicationManager from "./pages/MedicationManager";
import Community from "./pages/Community";
import FamilyData from "./pages/FamilyData";
import PersonalizedRecommendations from "./pages/PersonalizedRecommendations";
import OnboardingPage from "./pages/OnboardingPage";
import Auth from "./pages/Auth";
import RiskAssessmentDemo from "./pages/RiskAssessmentDemo";
import WomensHealthDemo from "./pages/WomensHealthDemo";
import EnvironmentalHealthDemo from "./pages/EnvironmentalHealthDemo";
import CommunityDemo from "./pages/CommunityDemo";
import AIAnalysisPage from "./pages/AIAnalysisPage";
import PersonalPlanPage from "./pages/PersonalPlan";
import "./App.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename="/">
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/ai-analysis" element={<AIAnalysisPage />} />
              <Route path="/personal-plan" element={<PersonalPlanPage />} />
              
              {/* Demo pages - accessible without auth */}
              <Route path="/risk-assessment-demo" element={<RiskAssessmentDemo />} />
              <Route path="/womens-health-demo" element={<WomensHealthDemo />} />
              <Route path="/environmental-health-demo" element={<EnvironmentalHealthDemo />} />
              <Route path="/community-demo" element={<CommunityDemo />} />
              
              {/* Protected routes */}
              <Route path="/onboarding" element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              } />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
              <Route path="/womens-health" element={
                <ProtectedRoute>
                  <WomensHealth />
                </ProtectedRoute>
              } />
              <Route path="/medical-integrations" element={
                <ProtectedRoute>
                  <MedicalIntegrations />
                </ProtectedRoute>
              } />
              <Route path="/risk-assessment" element={
                <ProtectedRoute>
                  <RiskAssessment />
                </ProtectedRoute>
              } />
              <Route path="/medical-calendar" element={
                <ProtectedRoute>
                  <MedicalCalendar />
                </ProtectedRoute>
              } />
              <Route path="/medications" element={
                <ProtectedRoute>
                  <MedicationManager />
                </ProtectedRoute>
              } />
              <Route path="/community" element={
                <ProtectedRoute>
                  <Community />
                </ProtectedRoute>
              } />
              <Route path="/family-data" element={
                <ProtectedRoute>
                  <FamilyData />
                </ProtectedRoute>
              } />
              <Route path="/recommendations" element={
                <ProtectedRoute>
                  <PersonalizedRecommendations />
                </ProtectedRoute>
              } />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
