
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import BackButton from '@/components/ui/back-button';
import MenstrualCycleDashboard from '@/components/menstrual/MenstrualCycleDashboard';

const MenstrualCycleTracker = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton fallbackPath="/womens-health-demo" className="mb-6" />
        <MenstrualCycleDashboard />
      </div>
    </div>
  );
};

export default MenstrualCycleTracker;
