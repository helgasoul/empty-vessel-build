
import React from 'react';
import { Shield } from "lucide-react";

const Footer = () => {
  return (
    <footer className="mt-32 border-t border-gray-200/50 bg-white/70 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center space-x-3 mb-6 md:mb-0">
            <div className="w-8 h-8 prevent-gradient-primary rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="text-gray-800 font-montserrat font-semibold">PREVENT Platform</span>
              <p className="text-xs text-gray-500 font-roboto">Персонализированная медицина</p>
            </div>
          </div>
          <p className="text-gray-500 text-sm font-roboto">
            © 2024 PREVENT. Революционная платформа превентивной медицины.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
