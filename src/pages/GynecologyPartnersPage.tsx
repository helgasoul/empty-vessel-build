
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import GynecologyPartnersSection from '@/components/medical/GynecologyPartnersSection';
import BackButton from '@/components/ui/back-button';

const GynecologyPartnersPage = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <BackButton fallbackPath="/dashboard" className="mb-4" />
        <GynecologyPartnersSection />
      </div>
    </div>
  );
};

export default GynecologyPartnersPage;
