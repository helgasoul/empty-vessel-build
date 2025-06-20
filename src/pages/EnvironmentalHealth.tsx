
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import EnvironmentalHealthDashboard from '@/components/environmental/EnvironmentalHealthDashboard';
import BackButton from '@/components/ui/back-button';

const EnvironmentalHealth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton fallbackPath="/dashboard" className="mb-4" />
        <EnvironmentalHealthDashboard />
      </div>
    </div>
  );
};

export default EnvironmentalHealth;
