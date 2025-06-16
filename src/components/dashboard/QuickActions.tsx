import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Smartphone, FileText, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();

  const actions = [
    {
      title: "Оценка рисков",
      description: "Пройти новую оценку рисков здоровья",
      icon: Calculator,
      color: "text-blue-600 bg-blue-100",
      path: "/risk-assessment"
    },
    {
      title: "Устройства",
      description: "Подключить носимые устройства",
      icon: Smartphone,
      color: "text-green-600 bg-green-100",
      path: "/external-integrations"
    },
    {
      title: "Медкарта",
      description: "Управление медицинскими записями",
      icon: FileText,
      color: "text-purple-600 bg-purple-100",
      path: "/medical-integrations"
    },
    {
      title: "Семейная история",
      description: "Семейный банк данных",
      icon: Users,
      color: "text-orange-600 bg-orange-100",
      path: "/family-data-bank"
    }
  ];

  return (
    <Card className="prevent-card">
      <CardHeader>
        <CardTitle className="font-montserrat">Быстрые действия</CardTitle>
        <CardDescription className="font-roboto">
          Часто используемые функции для управления здоровьем
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="outline"
              className="h-auto p-4 flex flex-col items-center space-y-2 hover:shadow-md transition-all"
              onClick={() => navigate(action.path)}
            >
              <div className={`p-2 rounded-lg ${action.color}`}>
                <action.icon className="w-5 h-5" />
              </div>
              <div className="text-center">
                <div className="font-medium text-sm">{action.title}</div>
                <div className="text-xs text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
