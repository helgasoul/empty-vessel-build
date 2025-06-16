
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, AlertCircle, Database } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const DataSaveVerifier = () => {
  const { user } = useAuth();
  const [checking, setChecking] = useState(false);
  const [results, setResults] = useState<any[]>([]);

  const checkDataIntegrity = async () => {
    if (!user) {
      toast({
        title: "Ошибка",
        description: "Необходимо войти в систему",
        variant: "destructive"
      });
      return;
    }

    setChecking(true);
    setResults([]);

    try {
      const checks = [
        {
          name: 'Профиль пользователя',
          table: 'profiles',
          query: supabase.from('profiles').select('*').eq('id', user.id).single()
        },
        {
          name: 'Оценки рисков',
          table: 'risk_assessments',
          query: supabase.from('risk_assessments').select('*').eq('user_id', user.id)
        },
        {
          name: 'Устройства пользователя',
          table: 'user_devices',
          query: supabase.from('user_devices').select('*').eq('user_id', user.id)
        },
        {
          name: 'Медицинские записи',
          table: 'medical_records',
          query: supabase.from('medical_records').select('*').eq('user_id', user.id)
        }
      ];

      const checkResults = [];

      for (const check of checks) {
        try {
          const { data, error } = await check.query;
          
          if (error && error.code !== 'PGRST116') {
            checkResults.push({
              ...check,
              status: 'error',
              message: error.message,
              data: null
            });
          } else {
            checkResults.push({
              ...check,
              status: 'success',
              message: `Найдено записей: ${Array.isArray(data) ? data.length : (data ? 1 : 0)}`,
              data: data
            });
          }
        } catch (err) {
          checkResults.push({
            ...check,
            status: 'error',
            message: err instanceof Error ? err.message : 'Неизвестная ошибка',
            data: null
          });
        }
      }

      setResults(checkResults);
      
      const hasErrors = checkResults.some(r => r.status === 'error');
      toast({
        title: hasErrors ? "Обнаружены проблемы" : "Все данные сохранены корректно",
        description: `Проверено ${checkResults.length} таблиц`,
        variant: hasErrors ? "destructive" : "default"
      });

    } catch (error) {
      console.error('Error checking data integrity:', error);
      toast({
        title: "Ошибка проверки",
        description: "Не удалось выполнить проверку данных",
        variant: "destructive"
      });
    } finally {
      setChecking(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge variant="default" className="bg-green-100 text-green-800">Успешно</Badge>;
      case 'error':
        return <Badge variant="destructive">Ошибка</Badge>;
      default:
        return <Badge variant="secondary">Неизвестно</Badge>;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-blue-600" />
          <span>Проверка сохранения данных</span>
        </CardTitle>
        <CardDescription>
          Проверьте, корректно ли сохраняются ваши данные в системе
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={checkDataIntegrity}
          disabled={checking}
          className="w-full"
        >
          {checking ? 'Проверка...' : 'Проверить сохранение данных'}
        </Button>

        {results.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-900">Результаты проверки:</h4>
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <p className="font-medium text-gray-900">{result.name}</p>
                    <p className="text-sm text-gray-600">{result.message}</p>
                  </div>
                </div>
                {getStatusBadge(result.status)}
              </div>
            ))}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Советы по сохранению данных:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Убедитесь, что у вас стабильное интернет-соединение</li>
            <li>• Заполняйте все обязательные поля формы</li>
            <li>• Проверяйте корректность введенных данных</li>
            <li>• Дождитесь подтверждения успешного сохранения</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataSaveVerifier;
