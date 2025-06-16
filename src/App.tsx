
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
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
import "./App.css";

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
}

export default App;
