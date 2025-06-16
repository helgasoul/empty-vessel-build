
import React from 'react';

interface RecipeIngredientsProps {
  ingredientsCount: number;
}

const RecipeIngredients = ({ ingredientsCount }: RecipeIngredientsProps) => {
  const ingredients = [
    "150г киноа",
    "200г свежих ягод (черника, малина)",
    "30г миндаля",
    "1 авокадо",
    "2 ст.л. семян чиа",
    "1 ст.л. кокосового масла",
    "200мл миндального молока",
    "1 ч.л. меда"
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">
        Ингредиенты ({ingredientsCount})
      </h3>
      <div className="grid md:grid-cols-2 gap-2">
        {ingredients.map((ingredient, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
            <span className="text-sm">{ingredient}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeIngredients;
