
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  Watch, 
  Smartphone, 
  Heart, 
  Activity, 
  Moon, 
  Footprints,
  Shield,
  CheckCircle,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

interface AppleWatchConnectionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: () => void;
  isLoading?: boolean;
}

const AppleWatchConnectionModal: React.FC<AppleWatchConnectionModalProps> = ({
  open,
  onOpenChange,
  onConnect,
  isLoading = false
}) => {
  const [step, setStep] = useState(1);

  const healthDataTypes = [
    {
      icon: Heart,
      name: 'Пульс и ЧСС',
      description: 'Мониторинг сердечного ритма в реальном времени',
      color: 'text-red-500'
    },
    {
      icon: Activity,
      name: 'Активность',
      description: 'Шаги, калории, активные минуты',
      color: 'text-green-500'
    },
    {
      icon: Moon,
      name: 'Анализ сна',
      description: 'Продолжительность и качество сна',
      color: 'text-purple-500'
    },
    {
      icon: Footprints,
      name: 'Тренировки',
      description: 'Детальная информация о физических упражнениях',
      color: 'text-blue-500'
    }
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      onConnect();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Watch className="w-10 h-10 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Подключение Apple Watch</h3>
              <p className="text-gray-600">
                Синхронизируйте данные о здоровье и активности с платформой PREVENT
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {healthDataTypes.map((type, index) => {
                const Icon = type.icon;
                return (
                  <Card key={index} className="p-3">
                    <CardContent className="p-0">
                      <div className="flex items-center space-x-2">
                        <Icon className={`w-5 h-5 ${type.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{type.name}</p>
                          <p className="text-xs text-gray-500 truncate">{type.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Shield className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Конфиденциальность данных</h3>
              <p className="text-gray-600">
                Ваши данные о здоровье защищены и используются только для персонализированных рекомендаций
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Шифрование данных</p>
                  <p className="text-sm text-gray-600">
                    Все данные передаются и хранятся в зашифрованном виде
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">GDPR совместимость</p>
                  <p className="text-sm text-gray-600">
                    Соблюдение международных стандартов защиты данных
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium">Контроль доступа</p>
                  <p className="text-sm text-gray-600">
                    Вы можете в любой момент отозвать разрешения
                  </p>
                </div>
              </div>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Данные используются только в медицинских целях
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Информация не передается третьим лицам без вашего согласия
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <Smartphone className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Инструкция по подключению</h3>
              <p className="text-gray-600">
                Следуйте этим шагам для подключения Apple Watch
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center flex-shrink-0">
                  1
                </div>
                <div>
                  <p className="font-medium">Откройте приложение "Здоровье" на iPhone</p>
                  <p className="text-sm text-gray-600">
                    Убедитесь, что Apple Watch синхронизированы с приложением
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center flex-shrink-0">
                  2
                </div>
                <div>
                  <p className="font-medium">Разрешите доступ к данным здоровья</p>
                  <p className="text-sm text-gray-600">
                    Нажмите "Подключить" и выберите данные для синхронизации
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-500 text-white text-sm rounded-full flex items-center justify-center flex-shrink-0">
                  3
                </div>
                <div>
                  <p className="font-medium">Подтвердите подключение</p>
                  <p className="text-sm text-gray-600">
                    Автоматическая синхронизация начнется сразу после подключения
                  </p>
                </div>
              </div>
            </div>

            <Card className="bg-gray-50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Нужна помощь?</p>
                    <p className="text-xs text-gray-600">Руководство по настройке</p>
                  </div>
                  <Button variant="ghost" size="sm">
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Watch className="w-5 h-5 text-blue-600" />
            <span>Apple Watch</span>
          </DialogTitle>
          <DialogDescription>
            Шаг {step} из 3: Настройка подключения
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          {renderStepContent()}
        </div>

        <Separator />

        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-2 h-2 rounded-full ${
                  i <= step ? 'bg-blue-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="flex space-x-2">
            {step > 1 && (
              <Button variant="outline" onClick={handleBack} disabled={isLoading}>
                Назад
              </Button>
            )}
            
            <Button onClick={handleNext} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Activity className="w-4 h-4 mr-2 animate-spin" />
                  Подключение...
                </>
              ) : step === 3 ? (
                'Подключить'
              ) : (
                'Далее'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AppleWatchConnectionModal;
