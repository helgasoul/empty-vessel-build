
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  TestTube, 
  Dna, 
  Microscope, 
  ExternalLink,
  Check,
  Clock,
  FileText,
  Calendar
} from "lucide-react";

interface LabService {
  id: string;
  name: string;
  type: 'genetic' | 'microbiome';
  description: string;
  icon: React.ReactNode;
  features: string[];
  price: string;
  duration: string;
  sampleType: string;
  isConnected: boolean;
}

const LabIntegrations = () => {
  const [labs] = useState<LabService[]>([
    {
      id: 'atlas-microbiome',
      name: 'Atlas Microbiome',
      type: 'microbiome',
      description: 'Анализ микробиома кишечника для персонализированных рекомендаций по питанию и здоровью',
      icon: <Microscope className="w-6 h-6" />,
      features: [
        'Анализ состава микробиома',
        'Рекомендации по питанию',
        'Оценка риска заболеваний',
        'Персональные пробиотики',
        'Мониторинг изменений'
      ],
      price: 'от 12 990 ₽',
      duration: '2-3 недели',
      sampleType: 'Образец стула',
      isConnected: false
    },
    {
      id: 'genotek-basic',
      name: 'Genotek Базовый',
      type: 'genetic',
      description: 'Генетический анализ основных предрасположенностей к заболеваниям',
      icon: <Dna className="w-6 h-6" />,
      features: [
        'Анализ 70+ генетических маркеров',
        'Предрасположенность к заболеваниям',
        'Метаболизм лекарств',
        'Спортивная генетика',
        'Происхождение'
      ],
      price: 'от 7 990 ₽',
      duration: '3-4 недели',
      sampleType: 'Слюна',
      isConnected: false
    },
    {
      id: 'genotek-premium',
      name: 'Genotek Премиум',
      type: 'genetic',
      description: 'Расширенный генетический анализ с консультацией генетика',
      icon: <TestTube className="w-6 h-6" />,
      features: [
        'Анализ 300+ генетических маркеров',
        'Консультация генетика',
        'Детальные рекомендации',
        'Фармакогенетика',
        'Риски онкологии',
        'Женское здоровье'
      ],
      price: 'от 24 990 ₽',
      duration: '4-5 недель',
      sampleType: 'Слюна',
      isConnected: false
    }
  ]);

  const [selectedLab, setSelectedLab] = useState<LabService | null>(null);
  const [orderDialogOpen, setOrderDialogOpen] = useState(false);

  const geneticLabs = labs.filter(lab => lab.type === 'genetic');
  const microbiomeLabs = labs.filter(lab => lab.type === 'microbiome');

  const handleOrder = (lab: LabService) => {
    setSelectedLab(lab);
    setOrderDialogOpen(true);
  };

  const LabCard = ({ lab }: { lab: LabService }) => (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              {lab.icon}
            </div>
            <div>
              <CardTitle className="text-lg">{lab.name}</CardTitle>
              <Badge variant={lab.type === 'genetic' ? 'default' : 'secondary'} className="mt-1">
                {lab.type === 'genetic' ? 'Генетика' : 'Микробиом'}
              </Badge>
            </div>
          </div>
        </div>
        <CardDescription>{lab.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-500" />
            <span>{lab.duration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <TestTube className="w-4 h-4 text-gray-500" />
            <span>{lab.sampleType}</span>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Что входит в анализ:</h4>
          <ul className="space-y-1">
            {lab.features.map((feature, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-center">
                <Check className="w-3 h-3 mr-2 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <p className="text-lg font-bold text-primary">{lab.price}</p>
          </div>
          <Button onClick={() => handleOrder(lab)}>
            Заказать анализ
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Лабораторные интеграции
        </h2>
        <p className="text-lg text-gray-600">
          Генетические анализы и исследование микробиома от ведущих лабораторий
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Dna className="w-5 h-5 mr-2" />
            Генетические анализы Genotek
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            {geneticLabs.map(lab => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4 flex items-center">
            <Microscope className="w-5 h-5 mr-2" />
            Анализ микробиома Atlas
          </h3>
          <div className="grid md:grid-cols-1 gap-6">
            {microbiomeLabs.map(lab => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        </div>
      </div>

      <Dialog open={orderDialogOpen} onOpenChange={setOrderDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Заказ анализа</DialogTitle>
          </DialogHeader>
          
          {selectedLab && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium">{selectedLab.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{selectedLab.description}</p>
                <p className="text-lg font-bold text-primary mt-2">{selectedLab.price}</p>
              </div>

              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">ФИО</Label>
                  <Input id="name" placeholder="Введите ваше ФИО" />
                </div>
                <div>
                  <Label htmlFor="phone">Телефон</Label>
                  <Input id="phone" placeholder="+7 (___) ___-__-__" />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="example@email.com" />
                </div>
                <div>
                  <Label htmlFor="address">Адрес доставки</Label>
                  <Input id="address" placeholder="Адрес для доставки набора" />
                </div>
              </div>

              <div className="flex space-x-2 pt-4">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setOrderDialogOpen(false)}
                >
                  Отмена
                </Button>
                <Button className="flex-1">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Перейти к оплате
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LabIntegrations;
