
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import NavigationMenu from '@/components/navigation/NavigationMenu';
import { MobileNavigation } from '@/components/navigation/MobileNavigation';
import Auth from '@/pages/Auth';
import Index from '@/pages/Index';
import Dashboard from '@/pages/Dashboard';
import Experts from '@/pages/Experts';
import AdminDashboardPage from '@/pages/AdminDashboard';
import DoctorDashboardPage from '@/pages/DoctorDashboardPage';
import DoctorProfile from '@/pages/DoctorProfile';
import ProtectedRoute from '@/components/ProtectedRoute';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="prevent-ui-theme">
        <AuthProvider>
          <div className="App">
            <Toaster />
            <BrowserRouter>
              <NavigationMenu />
              <Routes>
                <Route path="/landing" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/experts" element={<ProtectedRoute><Experts /></ProtectedRoute>} />
                <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboardPage /></ProtectedRoute>} />
                <Route path="/doctor-dashboard" element={<ProtectedRoute><DoctorDashboardPage /></ProtectedRoute>} />
                <Route path="/doctor-profile" element={<DoctorProfile />} />
              </Routes>
              <MobileNavigation />
            </BrowserRouter>
          </div>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
