
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Crown } from 'lucide-react';

interface AdminCodeInputProps {
  adminCode: string;
  onAdminCodeChange: (code: string) => void;
  isLoading: boolean;
}

const AdminCodeInput = ({ adminCode, onAdminCodeChange, isLoading }: AdminCodeInputProps) => {
  return (
    <div className="space-y-3 p-4 bg-red-50 border border-red-200 rounded-lg">
      <div className="flex items-center space-x-2">
        <Crown className="w-5 h-5 text-red-600" />
        <Label htmlFor="adminCode" className="font-roboto font-semibold text-red-800">
          Код администратора
        </Label>
      </div>
      <Input
        id="adminCode"
        type="password"
        placeholder="Введите код доступа администратора"
        value={adminCode}
        onChange={(e) => onAdminCodeChange(e.target.value)}
        required
        className="font-roboto border-red-300 focus:border-red-500"
        disabled={isLoading}
      />
      <p className="text-xs text-red-600">
        Обратитесь к главному администратору для получения кода доступа
      </p>
    </div>
  );
};

export default AdminCodeInput;
