
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  FileText, 
  Stethoscope, 
  ShoppingCart, 
  Users,
  Activity,
  ArrowRight
} from "lucide-react";

const QuickActions = () => {
  const actions = [
    {
      title: "Записаться на анализы",
      description: "Забронировать время в лаборатории-партнере",
      icon: FileText,
      color: "bg-blue-500",
      action: () => console.log("Анализы")
    },
    {
      title: "Консультация врача",
      description: "Онлайн консультация со специалистом",
      icon: Stethoscope,
      color: "bg-green-500",
      action: () => console.log("Консультация")
    },
    {
      title: "Фитнес и йога",
      description: "Записаться на тренировку или класс",
      icon: Activity,
      color: "bg-purple-500",
      action: () => console.log("Фитнес")
    },
    {
      title: "Заказать товары",
      description: "Спортивное питание и оборудование",
      icon: ShoppingCart,
      color: "bg-orange-500",
      action: () => console.log("Заказ")
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          <span>Быстрые действия</span>
        </CardTitle>
        <CardDescription>
          Часто используемые функции платформы
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <div key={index} className="group">
              <Button
                variant="outline"
                className="w-full h-auto p-4 hover:shadow-md transition-all duration-200 group-hover:border-gray-300"
                onClick={action.action}
              >
                <div className="flex items-center space-x-4 w-full">
                  <div className={`p-3 rounded-lg ${action.color} flex-shrink-0`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1 text-left">
                    <h4 className="font-medium text-gray-900 group-hover:text-gray-700">
                      {action.title}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-pink-600">12</p>
              <p className="text-xs text-gray-600">Анализов</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">5</p>
              <p className="text-xs text-gray-600">Консультаций</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">28</p>
              <p className="text-xs text-gray-600">Тренировок</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickActions;
