import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from '@/contexts/AuthContext';
import { QueryClient } from '@tanstack/react-query';
import NavigationMenu from '@/components/NavigationMenu';
import MobileNavigation from '@/components/MobileNavigation';
import Auth from '@/pages/Auth';
import Home from '@/pages/Home';
import Experts from '@/pages/Experts';
import AdminDashboardPage from '@/pages/AdminDashboard';
import DoctorDashboardPage from '@/pages/DoctorDashboard';
import DoctorProfilePage from '@/pages/DoctorProfile';
import ProtectedRoute from '@/components/ProtectedRoute';
import DoctorProfile from '@/pages/DoctorProfile';

function App() {
  return (
    <QueryClient>
      <ThemeProvider defaultTheme="light" storageKey="prevent-ui-theme">
        <AuthProvider>
          <div className="App">
            <Toaster />
            <BrowserRouter>
              <NavigationMenu />
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
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
    </QueryClient>
  );
}

export default App;
