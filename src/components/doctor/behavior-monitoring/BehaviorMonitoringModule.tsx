
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Activity, Heart, Moon, Utensils, TrendingUp, TrendingDown } from "lucide-react";

const BehaviorMonitoringModule = () => {
  const behaviorMetrics = [
    {
      category: "Физическая активность",
      icon: Activity,
      data: [
        { patient: "Анна П.", current: 8500, target: 10000, trend: "up", change: "+12%" },
        { patient: "Мария И.", current: 6200, target: 8000, trend: "down", change: "-5%" },
        { patient: "Елена С.", current: 12000, target: 10000, trend: "up", change: "+8%" }
      ]
    },
    {
      category: "Качество сна",
      icon: Moon,
      data: [
        { patient: "Анна П.", current: 7.2, target: 8.0, trend: "up", change: "+0.5ч" },
        { patient: "Мария И.", current: 6.1, target: 7.5, trend: "down", change: "-0.3ч" },
        { patient: "Елена С.", current: 8.5, target: 8.0, trend: "stable", change: "0ч" }
      ]
    },
    {
      category: "Питание",
      icon: Utensils,
      data: [
        { patient: "Анна П.", current: 85, target: 90, trend: "up", change: "+5%" },
        { patient: "Мария И.", current: 72, target: 80, trend: "up", change: "+3%" },
        { patient: "Елена С.", current: 91, target: 85, trend: "stable", change: "0%" }
      ]
    },
    {
      category: "Стресс-менеджмент",
      icon: Heart,
      data: [
        { patient: "Анна П.", current: 65, target: 70, trend: "up", change: "+8%" },
        { patient: "Мария И.", current: 45, target: 60, trend: "down", change: "-2%" },
        { patient: "Елена С.", current: 78, target: 75, trend: "up", change: "+5%" }
      ]
    }
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-500" />;
      default: return <div className="w-4 h-4 rounded-full bg-gray-400" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Мониторинг поведения</h2>
        <p className="text-gray-600 mt-1">
          Отслеживание образа жизни и поведенческих паттернов пациентов
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Обзор</TabsTrigger>
          <TabsTrigger value="activity">Активность</TabsTrigger>
          <TabsTrigger value="nutrition">Питание</TabsTrigger>
          <TabsTrigger value="sleep">Сон</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {behaviorMetrics.map((metric, index) => {
              const IconComponent = metric.icon;
              return (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <IconComponent className="w-5 h-5" />
                      <span>{metric.category}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {metric.data.map((item, itemIndex) => (
                        <div key={itemIndex} className="border rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium">{item.patient}</span>
                            <div className="flex items-center space-x-2">
                              {getTrendIcon(item.trend)}
                              <span className={`text-sm ${getTrendColor(item.trend)}`}>
                                {item.change}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-gray-600">
                              {typeof item.current === 'number' ? 
                                (item.current > 100 ? `${item.current} шагов` : `${item.current}ч`) :
                                `${item.current}%`
                              }
                            </span>
                            <span className="text-sm text-gray-500">
                              Цель: {typeof item.target === 'number' ? 
                                (item.target > 100 ? `${item.target} шагов` : `${item.target}ч`) :
                                `${item.target}%`
                              }
                            </span>
                          </div>
                          <Progress 
                            value={typeof item.current === 'number' ? 
                              (item.current / item.target) * 100 : item.current
                            } 
                            className="h-2" 
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Физическая активность</CardTitle>
              <CardDescription>
                Детальный анализ физической активности пациентов
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Здесь будет детальная аналитика по физической активности
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition">
          <Card>
            <CardHeader>
              <CardTitle>Питание</CardTitle>
              <CardDescription>
                Анализ пищевых привычек и соблюдения рекомендаций
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Здесь будет аналитика по питанию пациентов
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sleep">
          <Card>
            <CardHeader>
              <CardTitle>Качество сна</CardTitle>
              <CardDescription>
                Мониторинг режима сна и его качества
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Здесь будет аналитика по сну пациентов
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Инструменты и действия */}
      <Card>
        <CardHeader>
          <CardTitle>Инструменты мониторинга</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" size="sm">
              Настроить уведомления
            </Button>
            <Button variant="outline" size="sm">
              Экспорт данных
            </Button>
            <Button variant="outline" size="sm">
              Сравнить пациентов
            </Button>
            <Button variant="outline" size="sm">
              Создать отчет
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BehaviorMonitoringModule;
