
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from './components/landing/LandingPage';
import PatientDashboard from './components/dashboards/PatientDashboard';
import DoctorDashboard from './components/dashboards/DoctorDashboard';
import AdminDashboard from './components/admin/AdminDashboard';

// Создаем заглушки для недостающих компонентов
const ClinicDashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Clinic Dashboard</h1>
    <p>Coming soon...</p>
  </div>
);

const LaboratoryDashboard = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold">Laboratory Dashboard</h1>
    <p>Coming soon...</p>
  </div>
);

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
