
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { UserRole } from '@/types/user';

interface AuthInfoSectionProps {
  selectedRole: UserRole;
}

const AuthInfoSection = ({ selectedRole }: AuthInfoSectionProps) => {
  return (
    <div className="mt-6 space-y-2">
      <p className="text-center text-sm text-gray-600 font-roboto">
        Регистрируясь, вы соглашаетесь с нашими условиями использования и политикой конфиденциальности PREVENT
      </p>
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
        <div className="flex items-start space-x-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-blue-800">
            <p className="font-medium mb-1">Информация для тестирования:</p>
            <p>Если у вас проблемы с входом, убедитесь что email и пароль введены корректно. При возникновении ошибок проверьте консоль браузера для получения детальной информации.</p>
            {selectedRole === 'admin' && (
              <p className="mt-1 font-medium">Тестовый код администратора: PREVENT_ADMIN_2024</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthInfoSection;
