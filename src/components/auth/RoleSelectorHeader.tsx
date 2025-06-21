
import React from 'react';
import { Label } from '@/components/ui/label';

const RoleSelectorHeader = () => {
  return (
    <div className="text-center">
      <Label className="text-xl font-bold text-gray-900 mb-2 block">
        Выберите вашу роль в системе
      </Label>
      <p className="text-sm text-gray-600 mb-4">
        Выберите роль, которая лучше всего описывает ваше положение
      </p>
    </div>
  );
};

export default RoleSelectorHeader;
