
import React from 'react';
import { Button } from "@/components/ui/button";
import { Shield } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <nav className="w-full px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 prevent-gradient-primary rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-montserrat font-bold text-gray-900">PREVENT</span>
            <p className="text-xs text-gray-600 font-roboto">Персонализированная медицина</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => navigate('/auth')}
          className="hover:bg-primary/10 hover:border-primary transition-all duration-200 font-medium"
        >
          Войти
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
