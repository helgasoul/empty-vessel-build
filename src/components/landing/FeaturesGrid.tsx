
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Brain, FlaskConical, Shield, TrendingUp, Users } from "lucide-react";

const FeaturesGrid = () => {
  return (
    <div className="grid md:grid-cols-3 gap-8 mb-20 animate-slide-up">
      <Card className="prevent-card group">
        <CardHeader className="text-center pb-4">
          <div className="prevent-icon-container bg-primary/10 mx-auto mb-4 group-hover:bg-primary/20">
            <Activity className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-xl text-gray-900 font-montserrat">Оценка рисков QRISK3</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center text-gray-600 leading-relaxed font-roboto">
            Научно обоснованный анализ сердечно-сосудистых рисков с учетом ваших индивидуальных параметров и образа жизни.
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="prevent-card group">
        <CardHeader className="text-center pb-4">
          <div className="prevent-icon-container bg-secondary/10 mx-auto mb-4 group-hover:bg-secondary/20">
            <Brain className="w-6 h-6 text-secondary" />
          </div>
          <CardTitle className="text-xl text-gray-900 font-montserrat">Нейродегенеративные риски</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center text-gray-600 leading-relaxed font-roboto">
            Анализ рисков деменции и болезни Альцгеймера с использованием алгоритмов Framingham и DemPoRT.
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="prevent-card group">
        <CardHeader className="text-center pb-4">
          <div className="prevent-icon-container bg-accent/10 mx-auto mb-4 group-hover:bg-accent/20">
            <FlaskConical className="w-6 h-6 text-accent" />
          </div>
          <CardTitle className="text-xl text-gray-900 font-montserrat">Экологические риски</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center text-gray-600 leading-relaxed font-roboto">
            RAIS анализ воздействия химических веществ и загрязнителей окружающей среды на ваше здоровье.
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="prevent-card group">
        <CardHeader className="text-center pb-4">
          <div className="prevent-icon-container bg-green-100 mx-auto mb-4 group-hover:bg-green-200">
            <Shield className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-xl text-gray-900 font-montserrat">Онкологические риски</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center text-gray-600 leading-relaxed font-roboto">
            Комплексная оценка рисков рака молочной железы с использованием моделей BRCA, Gail и BCSC.
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="prevent-card group">
        <CardHeader className="text-center pb-4">
          <div className="prevent-icon-container bg-purple-100 mx-auto mb-4 group-hover:bg-purple-200">
            <TrendingUp className="w-6 h-6 text-purple-600" />
          </div>
          <CardTitle className="text-xl text-gray-900 font-montserrat">Интеграция устройств</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center text-gray-600 leading-relaxed font-roboto">
            Apple Watch, Oura Ring, Whoop, Libra - полная интеграция с носимыми устройствами для мониторинга здоровья.
          </CardDescription>
        </CardContent>
      </Card>

      <Card className="prevent-card group">
        <CardHeader className="text-center pb-4">
          <div className="prevent-icon-container bg-blue-100 mx-auto mb-4 group-hover:bg-blue-200">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-xl text-gray-900 font-montserrat">Медицинские сервисы</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-center text-gray-600 leading-relaxed font-roboto">
            Запись к врачам, анализы в лабораториях-партнерах, онлайн консультации и персонализированные программы.
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturesGrid;
