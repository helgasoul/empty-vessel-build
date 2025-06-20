
import React from 'react';
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import AdminProtectedRoute from '@/components/experts/AdminProtectedRoute';
import AdminDashboard from '@/components/admin/AdminDashboard';

const AdminDashboardPage = () => {
  return (
    <AdminProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { href: "/", label: "Главная" },
              { label: "Панель администратора" }
            ]}
            className="mb-6"
          />

          <AdminDashboard />
        </div>
      </div>
    </AdminProtectedRoute>
  );
};

export default AdminDashboardPage;
