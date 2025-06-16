
import React from 'react';

const RecipeNutrition = () => {
  const nutritionFacts = [
    { name: "Белки", value: "12г", percentage: 24 },
    { name: "Жиры", value: "18г", percentage: 32 },
    { name: "Углеводы", value: "45г", percentage: 44 },
    { name: "Клетчатка", value: "8г", percentage: 32 },
    { name: "Железо", value: "3.2мг", percentage: 18 },
    { name: "Магний", value: "89мг", percentage: 22 }
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Пищевая ценность (на порцию)</h3>
      <div className="space-y-3">
        {nutritionFacts.map((fact, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-sm">{fact.name}</span>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{fact.value}</span>
              <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full" 
                  style={{ width: `${fact.percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">{fact.percentage}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeNutrition;
