
import React, { useState } from 'react';
import { TopNavigation } from './TopNavigation';
import { Sidebar } from './Sidebar';
import { GlobalSearch } from './GlobalSearch';
import { FloatingActionButton } from './FloatingActionButton';

interface MainLayoutProps {
  children: React.ReactNode;
  currentModule?: string;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, currentModule }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-100 to-white">
      {/* Top Navigation */}
      <TopNavigation 
        onMenuClick={() => setSidebarOpen(true)}
        onSearchClick={() => setSearchOpen(true)}
      />
      
      {/* Sidebar Navigation */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentModule={currentModule}
      />
      
      {/* Main Content */}
      <main className="lg:ml-64 transition-all duration-300">
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
      
      {/* Global Search */}
      <GlobalSearch 
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
      />
      
      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
};
