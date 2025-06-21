
import React from 'react';
import BackButton from '@/components/ui/back-button';

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton fallbackPath="/dashboard" className="mb-4" />
        
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">
            Политика конфиденциальности
          </h1>
          
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-600 mb-4">
              Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">1. Сбор информации</h2>
            <p className="mb-4">
              Мы собираем информацию, которую вы предоставляете нам напрямую, например, 
              когда создаете учетную запись, загружаете медицинские документы или 
              связываетесь с нами для получения поддержки.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">2. Использование информации</h2>
            <p className="mb-4">
              Мы используем собранную информацию для предоставления, поддержания и 
              улучшения наших услуг, а также для связи с вами.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">3. Защита данных</h2>
            <p className="mb-4">
              Мы принимаем разумные меры для защиты вашей личной информации от 
              потери, кражи, неправильного использования и несанкционированного доступа.
            </p>
            
            <h2 className="text-xl font-semibold mt-8 mb-4">4. Контактная информация</h2>
            <p className="mb-4">
              Если у вас есть вопросы о данной политике конфиденциальности, 
              пожалуйста, свяжитесь с нами по адресу: privacy@prevent.health
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
