
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate, useSearchParams } from 'react-router-dom';
import WomensHealthDashboard from '@/components/health/WomensHealthDashboard';
import BackButton from '@/components/ui/back-button';

const WomensHealth = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const [initialTab, setInitialTab] = useState('overview');

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam) {
      setInitialTab(tabParam);
    }
  }, [searchParams]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton fallbackPath="/dashboard" className="mb-4" />
        <WomensHealthDashboard initialTab={initialTab} />
      </div>
    </div>
  );
};

export default WomensHealth;
