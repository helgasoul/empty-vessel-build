
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

const LandingPage = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <header className="bg-white/95 backdrop-blur-md border-b border-purple-200/30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                YTime PREVENT
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Привет, {user.name}!</span>
                  <Link to="/dashboard">
                    <Button>Перейти к дашборду</Button>
                  </Link>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Link to="/login">
                    <Button variant="outline">Войти</Button>
                  </Link>
                  <Link to="/register">
                    <Button>Регистрация</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Персональная платформа
            <span className="block bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              превентивной медицины
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            YTime PREVENT помогает женщинам управлять своим здоровьем через персонализированные 
            рекомендации, анализ рисков и интеграцию с медицинскими сервисами.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">👩‍💼</div>
              <h3 className="text-xl font-bold mb-2">Для пациентов</h3>
              <p className="text-gray-600">
                Отслеживайте здоровье, получайте персональные рекомендации
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">👩‍⚕️</div>
              <h3 className="text-xl font-bold mb-2">Для врачей</h3>
              <p className="text-gray-600">
                Ведите пациентов, используйте медицинские калькуляторы
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-lg">
              <div className="text-4xl mb-4">⚙️</div>
              <h3 className="text-xl font-bold mb-2">Администрирование</h3>
              <p className="text-gray-600">
                Управляйте платформой и медицинскими учреждениями
              </p>
            </div>
          </div>

          {!user && (
            <div className="space-x-4">
              <Link to="/register">
                <Button size="lg" className="text-lg px-8 py-4">
                  Начать бесплатно
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                  Войти в систему
                </Button>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
