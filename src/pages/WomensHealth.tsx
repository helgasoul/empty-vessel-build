
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import WomensHealthDashboard from '@/components/health/WomensHealthDashboard';

const WomensHealth = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <WomensHealthDashboard />
      </div>
    </div>
  );
};

export default WomensHealth;
