
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Apple, Dumbbell, User, Calendar, Clock, Zap } from "lucide-react";
import { getRecommendationsForAge, HealthRecommendation, NutritionRecommendation, FitnessRecommendation } from '@/utils/ageBasedRecommendations';

interface AgeBasedRecommendationsProps {
  userAge: number;
}

const AgeBasedRecommendations: React.FC<AgeBasedRecommendationsProps> = ({ userAge }) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const recommendations = getRecommendationsForAge(userAge);

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'high': return 'Высокий приоритет';
      case 'medium': return 'Средний приоритет';
      case 'low': return 'Низкий приоритет';
      default: return 'Обычный';
    }
  };

  const getIntensityIcon = (intensity?: string) => {
    switch (intensity) {
      case 'high': return <Zap className="w-4 h-4 text-red-500" />;
      case 'moderate': return <Zap className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Zap className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const HealthRecommendationCard: React.FC<{ recommendation: HealthRecommendation; index: number }> = ({ recommendation, index }) => {
    const cardId = `health-${index}`;
    const isExpanded = expandedItems.has(cardId);

    return (
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-500" />
                <span>{recommendation.title}</span>
              </CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getPriorityColor(recommendation.priority)}>
                  {getPriorityText(recommendation.priority)}
                </Badge>
                <Badge variant="outline">{recommendation.category}</Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpanded(cardId)}
            >
              {isExpanded ? 'Свернуть' : 'Подробнее'}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            <p className="text-gray-600">{recommendation.description}</p>
          </CardContent>
        )}
      </Card>
    );
  };

  const NutritionRecommendationCard: React.FC<{ recommendation: NutritionRecommendation; index: number }> = ({ recommendation, index }) => {
    const cardId = `nutrition-${index}`;
    const isExpanded = expandedItems.has(cardId);

    return (
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Apple className="w-5 h-5 text-green-500" />
                <span>{recommendation.title}</span>
              </CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge className={getPriorityColor(recommendation.priority)}>
                  {getPriorityText(recommendation.priority)}
                </Badge>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpanded(cardId)}
            >
              {isExpanded ? 'Свернуть' : 'Подробнее'}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            <p className="text-gray-600 mb-4">{recommendation.description}</p>
            <div className="space-y-3">
              <div>
                <h5 className="font-medium text-sm text-gray-800 mb-2">Ключевые питательные вещества:</h5>
                <div className="flex flex-wrap gap-1">
                  {recommendation.nutrients.map((nutrient, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {nutrient}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h5 className="font-medium text-sm text-gray-800 mb-2">Рекомендуемые продукты:</h5>
                <div className="flex flex-wrap gap-1">
                  {recommendation.foods.map((food, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {food}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    );
  };

  const FitnessRecommendationCard: React.FC<{ recommendation: FitnessRecommendation; index: number }> = ({ recommendation, index }) => {
    const cardId = `fitness-${index}`;
    const isExpanded = expandedItems.has(cardId);

    return (
      <Card className="mb-4 hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg flex items-center space-x-2">
                <Dumbbell className="w-5 h-5 text-blue-500" />
                <span>{recommendation.title}</span>
              </CardTitle>
              <div className="flex items-center space-x-2 mt-2">
                <Badge variant="outline">{recommendation.type}</Badge>
                <div className="flex items-center space-x-1">
                  {getIntensityIcon(recommendation.intensity)}
                  <span className="text-xs text-gray-600">
                    {recommendation.intensity === 'high' ? 'Высокая' : 
                     recommendation.intensity === 'moderate' ? 'Умеренная' : 'Низкая'} интенсивность
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{recommendation.frequency}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{recommendation.duration}</span>
                </div>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleExpanded(cardId)}
            >
              {isExpanded ? 'Свернуть' : 'Подробнее'}
            </Button>
          </div>
        </CardHeader>
        {isExpanded && (
          <CardContent>
            <p className="text-gray-600">{recommendation.description}</p>
          </CardContent>
        )}
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <User className="w-6 h-6 text-blue-600" />
            <span>Персонализированные рекомендации</span>
          </CardTitle>
          <CardDescription>
            Рекомендации для возрастной группы: <strong>{recommendations.ageGroup.name}</strong>
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="health" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="health" className="flex items-center space-x-2">
            <Heart className="w-4 h-4" />
            <span>Здоровье</span>
          </TabsTrigger>
          <TabsTrigger value="nutrition" className="flex items-center space-x-2">
            <Apple className="w-4 h-4" />
            <span>Питание</span>
          </TabsTrigger>
          <TabsTrigger value="fitness" className="flex items-center space-x-2">
            <Dumbbell className="w-4 h-4" />
            <span>Фитнес</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="health" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Рекомендации по здоровью</CardTitle>
              <CardDescription>
                Медицинские скрининги, профилактика и добавки для вашего возраста
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.health.map((recommendation, index) => (
                <HealthRecommendationCard 
                  key={index} 
                  recommendation={recommendation} 
                  index={index} 
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nutrition" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Рекомендации по питанию</CardTitle>
              <CardDescription>
                Питательные вещества и продукты, важные для вашего возраста
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.nutrition.map((recommendation, index) => (
                <NutritionRecommendationCard 
                  key={index} 
                  recommendation={recommendation} 
                  index={index} 
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fitness" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Рекомендации по фитнесу</CardTitle>
              <CardDescription>
                Программы тренировок, адаптированные под ваш возраст
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recommendations.fitness.map((recommendation, index) => (
                <FitnessRecommendationCard 
                  key={index} 
                  recommendation={recommendation} 
                  index={index} 
                />
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AgeBasedRecommendations;
