
import React from 'react';
import { Tabs } from "@/components/ui/tabs";
import AdminHeader from './AdminHeader';
import AdminStatsCards from './AdminStatsCards';
import AdminTabsNavigation from './AdminTabsNavigation';
import AdminTabContent from './AdminTabContent';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <AdminHeader />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <AdminStatsCards />

        <Tabs defaultValue="roles" className="space-y-6">
          <AdminTabsNavigation />
          <AdminTabContent />
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
