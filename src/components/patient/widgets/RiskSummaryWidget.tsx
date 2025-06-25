
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Shield, Target } from 'lucide-react';

// Simplified badge component
const Badge = ({ children, variant = 'default' }: { 
  children: React.ReactNode; 
  variant?: 'default' | 'success' | 'warning' | 'destructive';
}) => {
  const variants = {
    default: 'bg-blue-100 text-blue-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    destructive: 'bg-red-100 text-red-800'
  };
  
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  );
};

interface RiskData {
  condition: string;
  risk: string;
  level: 'low' | 'moderate' | 'high';
  timeframe: string;
}

interface RiskSummaryProps {
  risks?: RiskData[];
}

const RiskSummaryWidget: React.FC<RiskSummaryProps> = ({ 
  risks = [
    { condition: 'Рак молочной железы', risk: '2.3%', level: 'low', timeframe: '5 лет' },
    { condition: 'Сердечно-сосудистые заболевания', risk: '8.7%', level: 'moderate', timeframe: '10 лет' },
    { condition: 'Остеопороз', risk: '5.1%', level: 'low', timeframe: 'перелом' }
  ]
}) => {
  const getRiskColor = (level: string) => {
    switch (level) {
      case 'low': return 'bg-green-50 border-green-200';
      case 'moderate': return 'bg-yellow-50 border-yellow-200';
      case 'high': return 'bg-red-50 border-red-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'low': return <Badge variant="success">Низкий риск</Badge>;
      case 'moderate': return <Badge variant="warning">Средний риск</Badge>;
      case 'high': return <Badge variant="destructive">Высокий риск</Badge>;
      default: return <Badge variant="default">Неизвестно</Badge>;
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'low': return <Shield className="w-4 h-4 text-green-600" />;
      case 'moderate': return <Target className="w-4 h-4 text-yellow-600" />;
      case 'high': return <AlertTriangle className="w-4 h-4 text-red-600" />;
      default: return <Target className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-rose-500" />
          Оценка рисков
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {risks.map((risk, index) => (
            <div key={index} className={`p-4 border rounded-lg ${getRiskColor(risk.level)}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getRiskIcon(risk.level)}
                  <div>
                    <h4 className="font-medium text-gray-800">{risk.condition}</h4>
                    <p className="text-sm text-gray-600">
                      Риск за {risk.timeframe}: {risk.risk}
                    </p>
                  </div>
                </div>
                {getRiskBadge(risk.level)}
              </div>
            </div>
          ))}
        </div>
        
        <Button className="w-full mt-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600">
          Пройти полную оценку рисков
        </Button>
      </CardContent>
    </Card>
  );
};

export default RiskSummaryWidget;
