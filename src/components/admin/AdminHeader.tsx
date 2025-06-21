
import React from 'react';
import { Shield } from 'lucide-react';

const AdminHeader = () => {
  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-slate-600 to-indigo-600 w-12 h-12 rounded-full flex items-center justify-center shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Панель администратора</h1>
              <p className="text-slate-600 font-medium mt-1">Полное управление платформой PREVENT</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              Система работает
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
