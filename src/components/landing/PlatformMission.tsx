
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Shield, Brain, Activity, Users, Target } from "lucide-react";

const PlatformMission = () => {
  const jobsMap = [
    {
      category: "Основная задача",
      description: "Понимание личных рисков здоровья и способов их снижения",
      icon: Target,
      color: "text-red-600 bg-red-100"
    },
    {
      category: "Функциональные задачи", 
      description: "Подключение данных (Apple Health, анализы, генетика), персонализированные рекомендации, отслеживание прогресса",
      icon: Activity,
      color: "text-blue-600 bg-blue-100"
    },
    {
      category: "Эмоциональные задачи",
      description: "Снижение тревожности, чувство контроля, участие в науке",
      icon: Heart,
      color: "text-pink-600 bg-pink-100"
    },
    {
      category: "Социальные задачи",
      description: "Делиться ценностью с другими, вклад в этичные исследования",
      icon: Users,
      color: "text-green-600 bg-green-100"
    }
  ];

  return (
    <section className="py-16 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Миссия PREVENT
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Платформа женского здоровья, направленная на снижение рисков хронических заболеваний 
            через осознанность, изменения образа жизни и доказательную превентивную медицину
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {jobsMap.map((job, index) => {
            const IconComponent = job.icon;
            return (
              <Card key={index} className="h-full hover:shadow-lg transition-shadow">
                <CardHeader className="text-center">
                  <div className={`w-12 h-12 rounded-full ${job.color} flex items-center justify-center mx-auto mb-4`}>
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-lg font-semibold">
                    {job.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    {job.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Shield className="w-8 h-8 text-purple-600" />
                <CardTitle className="text-purple-900">Превентивная медицина</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-purple-800">
                Основанная на доказательствах система оценки рисков и персонализированных рекомендаций
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Brain className="w-8 h-8 text-blue-600" />
                <CardTitle className="text-blue-900">Данные и ИИ</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800">
                Мультифакторная оценка рисков онкологии, сердечно-сосудистых и нейродегенеративных заболеваний
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <Heart className="w-8 h-8 text-green-600" />
                <CardTitle className="text-green-900">Поддержка на всех этапах</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-green-800">
                Сопровождение женщин на всех этапах жизни с учетом возрастных особенностей и переходов
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default PlatformMission;
