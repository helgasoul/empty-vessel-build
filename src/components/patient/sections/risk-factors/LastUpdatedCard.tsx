
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface LastUpdatedCardProps {
  lastUpdated: Date;
}

export default function LastUpdatedCard({ lastUpdated }: LastUpdatedCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Последнее обновление</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600">
          Риски были рассчитаны: {lastUpdated.toLocaleDateString('ru-RU')}
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Рекомендуется обновлять оценку рисков каждые 6 месяцев или при изменении состояния здоровья
        </p>
      </CardContent>
    </Card>
  );
}
