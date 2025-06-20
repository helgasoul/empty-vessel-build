
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { useSymptomMoodLog } from '@/hooks/useSymptomMoodLog';
import { toast } from 'sonner';

interface QuickSymptomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QuickSymptomDialog = ({ open, onOpenChange }: QuickSymptomDialogProps) => {
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);
  const [moodRating, setMoodRating] = useState<number[]>([5]);
  const [energyLevel, setEnergyLevel] = useState<number[]>([5]);
  const { addLog } = useSymptomMoodLog();

  const symptoms = [
    'Боли внизу живота', 'Головная боль', 'Усталость', 'Тошнота',
    'Раздражительность', 'Отеки', 'Боль в груди', 'Сонливость',
    'Перепады настроения', 'Вздутие живота', 'Боль в пояснице',
    'Повышенный аппетит', 'Акне', 'Головокружение'
  ];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = async () => {
    try {
      await addLog({
        log_date: new Date().toISOString().split('T')[0],
        symptoms: selectedSymptoms,
        mood_rating: moodRating[0],
        energy_level: energyLevel[0]
      });
      
      // Сброс формы
      setSelectedSymptoms([]);
      setMoodRating([5]);
      setEnergyLevel([5]);
      onOpenChange(false);
      
      toast.success('Симптомы добавлены');
    } catch (error) {
      toast.error('Ошибка при добавлении симптомов');
    }
  };

  const getMoodEmoji = (rating: number) => {
    if (rating <= 2) return '😢';
    if (rating <= 4) return '😐';
    if (rating <= 6) return '🙂';
    if (rating <= 8) return '😊';
    return '😄';
  };

  const getEnergyEmoji = (rating: number) => {
    if (rating <= 2) return '😴';
    if (rating <= 4) return '😑';
    if (rating <= 6) return '🙂';
    if (rating <= 8) return '💪';
    return '⚡';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Как вы себя чувствуете?</DialogTitle>
          <DialogDescription>
            Выберите симптомы и оцените ваше настроение и уровень энергии
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Симптомы */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-800">Симптомы</h4>
            <div className="flex flex-wrap gap-2">
              {symptoms.map((symptom) => (
                <Badge
                  key={symptom}
                  variant={selectedSymptoms.includes(symptom) ? "default" : "outline"}
                  className={`cursor-pointer transition-all duration-200 ${
                    selectedSymptoms.includes(symptom)
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md'
                      : 'border-purple-200 text-purple-700 hover:bg-purple-50'
                  }`}
                  onClick={() => toggleSymptom(symptom)}
                >
                  {symptom}
                </Badge>
              ))}
            </div>
          </div>

          {/* Настроение */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
              Настроение {getMoodEmoji(moodRating[0])}
            </h4>
            <div className="px-4">
              <Slider
                value={moodRating}
                onValueChange={setMoodRating}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Плохое</span>
                <span className="font-medium">{moodRating[0]}/10</span>
                <span>Отличное</span>
              </div>
            </div>
          </div>

          {/* Уровень энергии */}
          <div>
            <h4 className="text-lg font-semibold mb-3 text-gray-800 flex items-center gap-2">
              Энергия {getEnergyEmoji(energyLevel[0])}
            </h4>
            <div className="px-4">
              <Slider
                value={energyLevel}
                onValueChange={setEnergyLevel}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-500 mt-2">
                <span>Низкая</span>
                <span className="font-medium">{energyLevel[0]}/10</span>
                <span>Высокая</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <Button 
            onClick={handleSubmit} 
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            disabled={selectedSymptoms.length === 0}
          >
            Сохранить
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)} 
            className="flex-1"
          >
            Отмена
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuickSymptomDialog;
