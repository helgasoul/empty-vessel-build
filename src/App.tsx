
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { RoleProvider } from "@/contexts/RoleContext";
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

// Import demo pages that were missing
import HormonalHealthDemo from "./pages/HormonalHealthDemo";
import MenopauseDemo from "./pages/MenopauseDemo";

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

// ✅ НОВЫЕ СТРАНИЦЫ: Семейные данные
import FamilyDataBank from "./pages/FamilyDataBank";
import FamilyHealthHistory from "./pages/FamilyHealthHistory";
import GeneticRisks from "./pages/GeneticRisks";

// ✅ НОВЫЕ СТРАНИЦЫ: Эксперты и партнеры
import Experts from "./pages/Experts";
import ExpertBlog from "./pages/ExpertBlog";
import Partners from "./pages/Partners";
import Team from "./pages/Team";

// ✅ АДМИН И ДОКТОР ДАШБОРДЫ
import AdminDashboardPage from "./pages/AdminDashboard";
import DoctorDashboardPage from "./pages/DoctorDashboardPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <RoleProvider>
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
                  
                  {/* ✅ Демо-страницы для женского здоровья */}
                  <Route path="/hormonal-health-demo" element={<HormonalHealthDemo />} />
                  <Route path="/menopause-demo" element={<MenopauseDemo />} />
                  
                  {/* ✅ НОВЫЕ МАРШРУТЫ: Семейные данные */}
                  <Route path="/family-data-bank" element={<FamilyDataBank />} />
                  <Route path="/family-health-history" element={<FamilyHealthHistory />} />
                  <Route path="/genetic-risks" element={<GeneticRisks />} />
                  
                  {/* ✅ НОВЫЕ МАРШРУТЫ: Эксперты и партнеры */}
                  <Route path="/experts" element={<Experts />} />
                  <Route path="/expert-blog" element={<ExpertBlog />} />
                  <Route path="/partners" element={<Partners />} />
                  <Route path="/team" element={<Team />} />
                  
                  {/* ✅ АДМИН И ДОКТОР ДАШБОРДЫ */}
                  <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
                  <Route path="/doctor-dashboard" element={<DoctorDashboardPage />} />
                  
                  {/* ✅ Временные заглушки для отсутствующих страниц */}
                  <Route path="/hormone-balance" element={
                    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
                      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Гормональный баланс</h1>
                        <p className="text-gray-600 mb-6">Эта функция находится в разработке</p>
                        <button 
                          onClick={() => window.history.back()}
                          className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                          Вернуться назад
                        </button>
                      </div>
                    </div>
                  } />
                  
                  <Route path="/menopause-support" element={
                    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50 flex items-center justify-center">
                      <div className="text-center p-8 bg-white rounded-xl shadow-lg">
                        <h1 className="text-2xl font-bold text-gray-800 mb-4">Поддержка менопаузы</h1>
                        <p className="text-gray-600 mb-6">Эта функция находится в разработке</p>
                        <button 
                          onClick={() => window.history.back()}
                          className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-colors"
                        >
                          Вернуться назад
                        </button>
                      </div>
                    </div>
                  } />
                  
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
            </RoleProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
