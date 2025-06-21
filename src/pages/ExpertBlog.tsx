
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowLeft, Calendar, User, Heart, Brain, Users } from "lucide-react";
import { useNavigate } from 'react-router-dom';

const ExpertBlog = () => {
  const navigate = useNavigate();

  const blogPosts = [
    {
      title: 'Женское здоровье после 40: что важно знать',
      author: 'Д-р Анна Смирнова',
      specialty: 'Гинеколог-эндокринолог',
      date: '15 декабря 2024',
      category: 'Женское здоровье',
      excerpt: 'Рассматриваем ключевые аспекты здоровья женщин в предменопаузальном периоде и важность регулярного мониторинга.',
      readTime: '7 мин',
      tags: ['Менопауза', 'Гормоны', 'Профилактика']
    },
    {
      title: 'Генетические тесты: когда они действительно нужны',
      author: 'Д-р Михаил Петров',
      specialty: 'Генетик',
      date: '12 декабря 2024',
      category: 'Генетика',
      excerpt: 'Разбираемся в видах генетических тестов и определяем, в каких случаях они могут быть полезны.',
      readTime: '5 мин',
      tags: ['Генетика', 'Тестирование', 'Диагностика']
    },
    {
      title: 'Стресс и иммунитет: невидимая связь',
      author: 'Д-р Елена Кузнецова',
      specialty: 'Психоиммунолог',
      date: '10 декабря 2024',
      category: 'Психосоматика',
      excerpt: 'Исследуем влияние хронического стресса на иммунную систему и способы поддержания баланса.',
      readTime: '6 мин',
      tags: ['Стресс', 'Иммунитет', 'Психология']
    }
  ];

  const categories = [
    { name: 'Женское здоровье', icon: Heart, count: 12 },
    { name: 'Генетика', icon: Brain, count: 8 },
    { name: 'Психосоматика', icon: Users, count: 6 },
    { name: 'Профилактика', icon: BookOpen, count: 15 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6 text-purple-600 hover:text-purple-700"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          На главную
        </Button>
        
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Блог экспертов PREVENT
          </h1>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Авторские статьи ведущих специалистов в области превентивной медицины, женского здоровья и современной диагностики.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Основной контент */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {blogPosts.map((post, index) => (
                <Card key={index} className="prevent-card-hover">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary" className="prevent-badge-soft">
                        {post.category}
                      </Badge>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <CardTitle className="text-xl mb-2 hover:text-purple-600 cursor-pointer">
                      {post.title}
                    </CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{post.author}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{post.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-purple-600 font-medium">{post.specialty}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4 leading-relaxed">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-2 flex-wrap">
                        {post.tags.map((tag, tagIndex) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button size="sm" className="prevent-button-primary">
                        Читать далее
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Боковая панель */}
          <div className="space-y-6">
            <Card className="prevent-card">
              <CardHeader>
                <CardTitle className="text-lg">Категории</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map((category, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-purple-50 cursor-pointer transition-colors">
                      <div className="flex items-center gap-3">
                        <category.icon className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {category.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="prevent-card">
              <CardHeader>
                <CardTitle className="text-lg">Популярные теги</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {['Менопауза', 'Гормоны', 'Профилактика', 'Генетика', 'Стресс', 'Иммунитет', 'Диагностика'].map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs cursor-pointer hover:bg-purple-50">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="prevent-card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardContent className="pt-6">
                <BookOpen className="w-8 h-8 text-purple-500 mb-3" />
                <h3 className="font-semibold mb-2">Подписка на новости</h3>
                <p className="text-gray-600 text-sm mb-4">
                  Получайте новые статьи от экспертов на почту
                </p>
                <Button className="w-full prevent-button-primary">
                  Подписаться
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12 text-center">
          <Card className="prevent-card bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
            <CardContent className="pt-6">
              <Brain className="w-12 h-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Страница находится в разработке</h3>
              <p className="text-gray-600 mb-4">
                Мы готовим качественный контент от ведущих специалистов в области женского здоровья.
              </p>
              <Button 
                onClick={() => navigate('/experts')}
                className="prevent-button-primary"
              >
                Познакомиться с экспертами
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ExpertBlog;
