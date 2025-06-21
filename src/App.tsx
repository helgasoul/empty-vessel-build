
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { SecurityProvider } from "@/components/security/SecurityProvider";
import { ThemeProvider } from "@/components/theme-provider";
import MainPageRouter from "./components/MainPageRouter";

// Import all pages that should be accessible
import PersonalPlanPage from "./pages/PersonalPlan";
import RiskAssessmentDemo from "./pages/RiskAssessmentDemo";
import WomensHealthDemo from "./pages/WomensHealthDemo";
import EnvironmentalHealthDemo from "./pages/EnvironmentalHealthDemo";
import CommunityDemo from "./pages/CommunityDemo";
import About from "./pages/About";
import Subscription from "./pages/Subscription";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// Import dashboard pages
import Profile from "./pages/Profile";
import WomensHealth from "./pages/WomensHealth";
import RiskAssessment from "./pages/RiskAssessment";
import MedicalIntegrations from "./pages/MedicalIntegrations";
import MenstrualCycleTracker from "./pages/MenstrualCycleTracker";
import PregnancyPlanningPage from "./pages/PregnancyPlanningPage";
import MedicalCalendar from "./pages/MedicalCalendar";
import MedicationManager from "./pages/MedicationManager";
import AIHealth from "./pages/AIHealth";
import FamilyData from "./pages/FamilyData";
import TelemedicineIntegrations from "./pages/TelemedicineIntegrations";
import EnvironmentalHealth from "./pages/EnvironmentalHealth";
import GamificationPage from "./pages/GamificationPage";
import Community from "./pages/Community";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <SecurityProvider
              enableSessionSecurity={true}
              sessionConfig={{
                maxIdleTime: 60, // 1 hour
                enableAutoLogout: true,
                trackActivity: true
              }}
            >
              <Routes>
                {/* Главная страница с роутером */}
                <Route path="/" element={<MainPageRouter />} />
                
                {/* Страницы лендинга */}
                <Route path="/personal-plan" element={<PersonalPlanPage />} />
                <Route path="/risk-assessment-demo" element={<RiskAssessmentDemo />} />
                <Route path="/womens-health-demo" element={<WomensHealthDemo />} />
                <Route path="/environmental-health-demo" element={<EnvironmentalHealthDemo />} />
                <Route path="/community-demo" element={<CommunityDemo />} />
                <Route path="/about" element={<About />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Основные страницы приложения */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/womens-health" element={<WomensHealth />} />
                <Route path="/risk-assessment" element={<RiskAssessment />} />
                <Route path="/medical-integrations" element={<MedicalIntegrations />} />
                <Route path="/menstrual-cycle-tracker" element={<MenstrualCycleTracker />} />
                <Route path="/pregnancy-planning" element={<PregnancyPlanningPage />} />
                <Route path="/medical-calendar" element={<MedicalCalendar />} />
                <Route path="/medications" element={<MedicationManager />} />
                <Route path="/ai-health" element={<AIHealth />} />
                <Route path="/family-data" element={<FamilyData />} />
                <Route path="/telemedicine-integrations" element={<TelemedicineIntegrations />} />
                <Route path="/environmental-health" element={<EnvironmentalHealth />} />
                <Route path="/gamification" element={<GamificationPage />} />
                <Route path="/community" element={<Community />} />
                
                {/* 404 страница */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SecurityProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
