
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
import NotFound from "./pages/NotFound";

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
