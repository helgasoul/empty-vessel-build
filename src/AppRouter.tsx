import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/landing/LandingPage';
import { PatientDashboard } from './components/dashboards/PatientDashboard';
import { DoctorDashboard } from './components/dashboards/DoctorDashboard';
import { ClinicDashboard } from './components/dashboards/ClinicDashboard';
import { LaboratoryDashboard } from './components/dashboards/LaboratoryDashboard';
import { AdminDashboard } from './components/dashboards/AdminDashboard';

function AppRouter() {
  return (
    <Router>
      <Routes>
        {/* Лендинг страница */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Дашборды для разных ролей */}
        <Route path="/patient/dashboard" element={<PatientDashboard />} />
        <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
        <Route path="/clinic/dashboard" element={<ClinicDashboard />} />
        <Route path="/laboratory/dashboard" element={<LaboratoryDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        
        {/* Перенаправление для неизвестных маршрутов */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;