
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TestSchedulingSectionProps {
  collectionDate: string;
  collectionTime: string;
  onCollectionDateChange: (value: string) => void;
  onCollectionTimeChange: (value: string) => void;
}

const TestSchedulingSection: React.FC<TestSchedulingSectionProps> = ({
  collectionDate,
  collectionTime,
  onCollectionDateChange,
  onCollectionTimeChange,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="collection_date">Дата сдачи</Label>
        <Input
          id="collection_date"
          type="date"
          value={collectionDate}
          onChange={(e) => onCollectionDateChange(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="collection_time">Время сдачи</Label>
        <Input
          id="collection_time"
          type="time"
          value={collectionTime}
          onChange={(e) => onCollectionTimeChange(e.target.value)}
        />
      </div>
    </div>
  );
};

export default TestSchedulingSection;
