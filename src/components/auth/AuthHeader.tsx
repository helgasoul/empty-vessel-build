
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AuthHeader = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center mb-8">
      <Button
        variant="ghost"
        onClick={() => navigate('/')}
        className="absolute left-4 top-4 hover:bg-white/80"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Назад
      </Button>
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 prevent-gradient-primary rounded-xl flex items-center justify-center">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <div>
          <span className="text-2xl font-montserrat font-bold text-gray-900">PREVENT</span>
          <p className="text-xs text-gray-600 font-roboto">Персонализированная медицина</p>
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;
