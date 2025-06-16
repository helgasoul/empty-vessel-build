
import React from 'react';
import { useUserAge } from '@/hooks/useUserAge';
import AgeBasedRecommendations from '@/components/recommendations/AgeBasedRecommendations';
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const PersonalizedRecommendations: React.FC = () => {
  const { age, loading } = useUserAge();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
              <p className="text-gray-600">Загрузка персонализированных рекомендаций...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!age) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-600 mb-4">
                Для получения персонализированных рекомендаций укажите дату рождения в профиле
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        <AgeBasedRecommendations userAge={age} />
      </div>
    </div>
  );
};

export default PersonalizedRecommendations;
