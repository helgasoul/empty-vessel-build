
import React from 'react';

export const AppLoader = () => (
  <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-rose-200 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
      <h2 className="text-xl font-semibold text-gray-800 mb-2">YTime PREVENT</h2>
      <p className="text-gray-600">Загрузка платформы...</p>
    </div>
  </div>
);
