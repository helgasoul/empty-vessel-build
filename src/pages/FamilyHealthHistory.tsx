
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Users, ArrowLeft, Heart, Brain, Dna } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const FamilyHealthHistory = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          На главную
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            История здоровья семьи
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Создайте полную медицинскую историю вашей семьи для лучшего понимания генетических рисков и наследственных предрасположенностей.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="prevent-card-hover">
            <CardHeader className="pb-4">
              <div className="prevent-icon-container bg-blue-500 mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Медицинские записи</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Ведите записи о заболеваниях, операциях и важных медицинских событиях в семье.
              </p>
              <Button className="w-full prevent-button-primary">
                Добавить запись
              </Button>
            </CardContent>
          </Card>

          <Card className="prevent-card-hover">
            <CardHeader className="pb-4">
              <div className="prevent-icon-container bg-green-500 mb-4">
                <Users className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Родословная</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Постройте интерактивное генеалогическое древо с медицинской информацией.
              </p>
              <Button className="w-full prevent-button-secondary">
                Создать древо
              </Button>
            </CardContent>
          </Card>

          <Card className="prevent-card-hover">
            <CardHeader className="pb-4">
              <div className="prevent-icon-container bg-purple-500 mb-4">
                <Dna className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-xl">Генетический анализ</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Анализируйте паттерны наследования и потенциальные риски.
              </p>
              <Button className="w-full prevent-button-soft">
                Анализировать
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="prevent-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Heart className="w-6 h-6 text-purple-600" />
              Возможности платформы
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Что вы можете отслеживать:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Сердечно-сосудистые заболевания</li>
                  <li>• Онкологические заболевания</li>
                  <li>• Эндокринные нарушения</li>
                  <li>• Психические расстройства</li>
                  <li>• Аутоиммунные заболевания</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Преимущества ведения истории:</h3>
                <ul className="space-y-2 text-gray-600">
                  <li>• Раннее выявление рисков</li>
                  <li>• Персонализированные рекомендации</li>
                  <li>• Информированные медицинские решения</li>
                  <li>• Планирование профилактики</li>
                  <li>• Генетическое консультирование</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Card className="prevent-card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-6">
              <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Страница находится в разработке</h3>
              <p className="text-gray-600 mb-4">
                Мы работаем над созданием комплексного инструмента для ведения семейной медицинской истории.
              </p>
              <Button 
                onClick={() => navigate('/family-data-bank')}
                className="prevent-button-primary"
              >
                Перейти к семейному банку данных
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FamilyHealthHistory;
