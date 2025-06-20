
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Award, Users, Heart, FileText, ExternalLink } from "lucide-react";
import { useFounderInfo } from '@/hooks/useFounderInfo';
import FounderEditForm from './FounderEditForm';

const FounderSection = () => {
  const { data: founderInfo, isLoading, error } = useFounderInfo();

  // Всегда показываем секцию основателя, даже если данные загружаются
  const founder = founderInfo || {
    id: 'default',
    name: 'Др. Ольга Пучкова',
    title: 'Врач-онколог, маммолог • Основатель и CEO PREVENT',
    description: 'Врач-онколог с 20-летним опытом работы в области женского здоровья и превентивной медицины. Специалист по ранней диагностике онкологических заболеваний, эксперт в области маммологии и ультразвуковой диагностики.',
    education: [
      'Московская Медицинская Академия им И.М. Сеченова, лечебное дело (1999-2005)',
      'Ординатура по специальности «Хирургия», ММА им И.М. Сеченова (2005-2007)',
      'Первичная переподготовка по специальности «Онкология», ММА им И.М. Сеченова (2007-2009)',
      'Первичная переподготовка по специальности «Ультразвуковая диагностика», БУЗ ВМХЦ им Н.И. Пирогова (2008-2010)',
      'Первичная переподготовка по специальности «Рентгенология», ФГБУ РНЦРР (2010-2012)'
    ],
    achievements: [
      'Повышение квалификации «Маммология» (2008)',
      'Специализация «Интервенционная диагностика в маммологии» (2010)',
      'Обучение «Основы клинической и эстетической маммологии» (2010)',
      'Сертификат «Ultrasound guided breast biopsy», Австрия (2011)',
      'Мастер-класс «Stereotactic guided breast biopsy» и «MRI guided breast biopsy» (2012)',
      'Курс профессора László Tabár по ранней диагностике рака молочной железы, Швеция (2012)'
    ],
    quote: 'Моя миссия — дать каждой женщине уверенность в завтрашнем дне через знания, заботу и современные технологии диагностики. Превентивная медицина — это не просто выявление рисков, это путь к гармонии между телом и душой.',
    image_url: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    certificates: []
  };

  if (isLoading) {
    return (
      <section className="py-20 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>Основатель проекта</span>
          </div>
          
          <h2 className="text-4xl font-montserrat font-bold text-gray-900 dark:text-white mb-4">
            Кто стоит за <span className="prevent-gradient-primary bg-clip-text text-transparent">PREVENT</span>
          </h2>
          
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-roboto">
            Встречайте врача, которая посвятила свою жизнь женскому здоровью
          </p>
        </div>

        <Card className="max-w-4xl mx-auto overflow-hidden shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative h-96 md:h-full bg-gray-200 animate-pulse"></div>
              <div className="p-8 md:p-12 flex flex-col justify-center space-y-4">
                <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="py-20 relative">
      <div className="text-center mb-16">
        <div className="inline-flex items-center space-x-2 bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-medium mb-8">
          <Sparkles className="w-4 h-4" />
          <span>Основатель проекта</span>
        </div>
        
        <h2 className="text-4xl font-montserrat font-bold text-gray-900 dark:text-white mb-4">
          Кто стоит за <span className="prevent-gradient-primary bg-clip-text text-transparent">PREVENT</span>
        </h2>
        
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed font-roboto">
          Встречайте врача, которая посвятила свою жизнь женскому здоровью
        </p>
      </div>

      <Card className="max-w-4xl mx-auto overflow-hidden shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Фотография */}
            <div className="relative h-96 md:h-full">
              <img
                src={founder.image_url}
                alt={`${founder.name} - Основатель PREVENT`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Фоллбэк изображение в случае ошибки загрузки
                  const target = e.target as HTMLImageElement;
                  target.src = 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Информация */}
            <div className="p-8 md:p-12 flex flex-col justify-center">
              <div className="mb-6">
                <h3 className="text-3xl font-montserrat font-bold text-gray-900 dark:text-white mb-2">
                  {founder.name}
                </h3>
                <p className="text-xl text-primary font-medium mb-4">
                  {founder.title}
                </p>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Award className="w-3 h-3 mr-1" />
                    20+ лет опыта
                  </Badge>
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                    <Users className="w-3 h-3 mr-1" />
                    Онколог-маммолог
                  </Badge>
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    <Heart className="w-3 h-3 mr-1" />
                    Превентивная медицина
                  </Badge>
                </div>
              </div>

              <div className="space-y-6 text-gray-700 dark:text-gray-300 font-roboto">
                {/* Основная информация */}
                <div>
                  <p className="leading-relaxed mb-4">
                    {founder.description}
                  </p>
                </div>

                {/* Опыт в диагностике */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                    15+ лет в диагностике заболеваний молочной железы
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 mt-1">•</span>
                      <span>Провела тысячи консультаций, помогая женщинам понять свое здоровье</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 mt-1">•</span>
                      <span>Руководила командами из 10+ специалистов в ведущих медицинских центрах Москвы</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 mt-1">•</span>
                      <span>Увеличила эффективность диагностики на 74% благодаря внедрению новых стандартов</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-500 mr-2 mt-1">•</span>
                      <span>Аккредитация EUSOBI — европейской ассоциации специалистов по маммографии (2016)</span>
                    </li>
                  </ul>
                </div>

                {/* Экспертность в AI */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                    Экспертность в области AI и медицины
                  </h4>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span>Ведущий клинический специалист в SBERmed.AI</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span>Оценила более 100 проектов по применению AI в медицине</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span>Вывела на рынок 2 продукта с AI для диагностики</span>
                    </li>
                  </ul>
                </div>

                {/* Миссия платформы */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
                    Почему я создала эту платформу
                  </h4>
                  <p className="text-sm leading-relaxed">
                    Работая в разных странах и медицинских системах, я видела, как женщины часто остаются без ответов на важные вопросы о своем здоровье. Языковые барьеры, недоступность специалистов, страх перед процедурами — все это мешает своевременной диагностике и лечению.
                  </p>
                  <p className="text-sm leading-relaxed mt-2 font-medium text-primary">
                    Эта платформа — мой способ быть рядом с каждой женщиной, предоставляя профессиональные консультации, основанные на современных технологиях и многолетнем опыте.
                  </p>
                </div>

                {/* Сертификаты */}
                {founder.certificates && Array.isArray(founder.certificates) && founder.certificates.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Сертификаты:</h4>
                    <div className="flex flex-wrap gap-2">
                      {founder.certificates.map((cert, index) => (
                        <a
                          key={index}
                          href={cert}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm bg-blue-50 px-2 py-1 rounded"
                        >
                          <FileText className="w-3 h-3" />
                          <span>Сертификат {index + 1}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {founder.quote && (
                <div className="mt-8 p-6 prevent-gradient-accent rounded-xl text-white">
                  <blockquote className="text-lg font-medium leading-relaxed">
                    "{founder.quote}"
                  </blockquote>
                  <cite className="block mt-3 text-accent-foreground/90 font-medium">
                    — {founder.name}
                  </cite>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <FounderEditForm />
    </section>
  );
};

export default FounderSection;
