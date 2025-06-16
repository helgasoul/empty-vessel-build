
import React from 'react';

const RecipeInstructions = () => {
  const instructions = [
    "Промойте киноа под холодной водой до тех пор, пока вода не станет прозрачной.",
    "Отварите киноа в подсоленной воде согласно инструкции на упаковке (обычно 12-15 минут).",
    "Пока киноа варится, нарежьте авокадо небольшими кубиками.",
    "Обжарьте миндаль на сухой сковороде до золотистого цвета.",
    "Смешайте готовую киноа с авокадо, ягодами и семенами чиа.",
    "Добавьте миндальное молоко и мед, аккуратно перемешайте.",
    "Выложите в тарелку, украсьте обжаренным миндалем и подавайте."
  ];

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Инструкции по приготовлению</h3>
      <div className="space-y-3">
        {instructions.map((instruction, index) => (
          <div key={index} className="flex space-x-3">
            <div className="flex-shrink-0 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </div>
            <p className="text-sm leading-relaxed">{instruction}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeInstructions;
