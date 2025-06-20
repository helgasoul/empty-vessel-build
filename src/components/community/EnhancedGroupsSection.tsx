
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  UserPlus,
  Shield,
  Sparkles,
  Baby,
  Activity,
  Flame,
  Brain,
  Calendar,
  Video,
  BookOpen,
  TrendingUp
} from "lucide-react";
import { useSupportGroups } from "@/hooks/useSupportGroups";
import { SupportGroupCard } from "./SupportGroupCard";

const EnhancedGroupsSection = () => {
  const { data: supportGroups, isLoading } = useSupportGroups();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const groupCategories = [
    { 
      id: 'all', 
      name: 'Все группы', 
      icon: Users, 
      color: 'from-pink-100 to-purple-100',
      emoji: '🌸'
    },
    { 
      id: 'age_20_35', 
      name: 'Женщины 20–35', 
      icon: Sparkles, 
      color: 'from-pink-100 to-rose-100',
      emoji: '🌸'
    },
    { 
      id: 'pregnancy_planning', 
      name: 'Планирующие беременность', 
      icon: Baby, 
      color: 'from-purple-100 to-indigo-100',
      emoji: '🤰'
    },
    { 
      id: 'hormonal_health', 
      name: 'ПМС и гормоны', 
      icon: Activity, 
      color: 'from-blue-100 to-cyan-100',
      emoji: '🔁'
    },
    { 
      id: 'menopause', 
      name: 'Менопауза без страха', 
      icon: Flame, 
      color: 'from-orange-100 to-amber-100',
      emoji: '🔥'
    },
    { 
      id: 'mental_health', 
      name: 'Осознанность и тревожность', 
      icon: Brain, 
      color: 'from-green-100 to-emerald-100',
      emoji: '🧘‍♀️'
    }
  ];

  const featuredGroups = [
    {
      id: 'featured_1',
      name: '🌸 Женщины 20–35',
      description: 'Обсуждаем карьеру, отношения, здоровье и планы на будущее. Здесь каждая найдёт поддержку и понимание.',
      members: 1284,
      isActive: true,
      category: 'age_20_35',
      recentActivity: 'Новый пост 15 мин назад',
      weeklyEvents: 'Еженедельные беседы по средам',
      moderator: 'Анна М.'
    },
    {
      id: 'featured_2',
      name: '🤰 Планирующие беременность',
      description: 'Поддержка, советы и опыт на пути к материнству. Делимся радостями и переживаниями.',
      members: 892,
      isActive: true,
      category: 'pregnancy_planning',
      recentActivity: 'Новый вопрос 32 мин назад',
      weeklyEvents: 'Q&A с врачом каждую пятницу',
      moderator: 'Др. Елена К.'
    },
    {
      id: 'featured_3',
      name: '🔁 ПМС и гормональный баланс',
      description: 'Вместе изучаем наши циклы, делимся способами облегчения симптомов и поддерживаем друг друга.',
      members: 734,
      isActive: true,
      category: 'hormonal_health',
      recentActivity: 'Обсуждение активно',
      weeklyEvents: 'Мониторинг симптомов',
      moderator: 'Мария В.'
    }
  ];

  const upcomingEvents = [
    {
      id: 'event_1',
      title: 'Вебинар: "Гормоны и настроение"',
      date: '23 июня, 19:00',
      speaker: 'Др. Анна Иванова',
      group: '🔁 ПМС и гормональный баланс',
      participants: 45
    },
    {
      id: 'event_2',
      title: 'Групповая медитация',
      date: '25 июня, 20:00',
      speaker: 'Ведущая Мария',
      group: '🧘‍♀️ Осознанность и тревожность',
      participants: 28
    }
  ];

  return (
    <div className="space-y-6">
      {/* Категории групп */}
      <Card className="bg-white/80 backdrop-blur-sm border-pink-100">
        <CardHeader>
          <CardTitle className="font-montserrat">Найти свою группу</CardTitle>
          <CardDescription className="font-roboto">
            Присоединяйтесь к сообществам по интересам и жизненным ситуациям
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {groupCategories.map((category) => {
              const CategoryIcon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`h-auto p-4 flex flex-col items-center space-y-2 ${
                    selectedCategory === category.id 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0' 
                      : 'border-pink-200 hover:bg-pink-50'
                  }`}
                >
                  <div className="text-2xl">{category.emoji}</div>
                  <div className="text-center">
                    <div className="font-medium text-xs">{category.name}</div>
                  </div>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Рекомендованные группы */}
      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-pink-500" />
            <CardTitle className="font-montserrat text-pink-800">Рекомендованные группы для вас</CardTitle>
          </div>
          <CardDescription className="font-roboto">
            На основе ваших интересов и активности
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredGroups.map((group) => (
              <div key={group.id} className="bg-white/80 rounded-lg p-4 border border-pink-100">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-900">{group.name}</h3>
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-1" />
                      Активна
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 font-roboto">{group.description}</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-xs text-gray-500">
                      <Users className="w-3 h-3 mr-1" />
                      <span>{group.members} участниц</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      <span>{group.recentActivity}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{group.weeklyEvents}</span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Shield className="w-3 h-3 mr-1" />
                      <span>Модератор: {group.moderator}</span>
                    </div>
                  </div>
                  <Button className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                    <UserPlus className="w-4 h-4 mr-2" />
                    Присоединиться
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Предстоящие события */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-blue-500" />
            <CardTitle className="font-montserrat text-blue-800">Предстоящие события</CardTitle>
          </div>
          <CardDescription className="font-roboto">
            Вебинары, встречи и активности сообщества
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="bg-white/80 rounded-lg p-4 border border-blue-100">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 mb-1">{event.title}</h4>
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Calendar className="w-3 h-3 mr-2" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-2" />
                        <span>{event.speaker}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-3 h-3 mr-2" />
                        <span>{event.group}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-600">{event.participants}</div>
                    <div className="text-xs text-gray-500">участниц</div>
                  </div>
                </div>
                <div className="mt-3 flex space-x-2">
                  <Button size="sm" className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                    Записаться
                  </Button>
                  <Button variant="outline" size="sm" className="border-blue-200">
                    Подробнее
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Все группы */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse bg-white/60">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : supportGroups?.length ? (
          supportGroups.map((group) => (
            <SupportGroupCard key={group.id} group={group} />
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <div className="text-gray-400 mb-4">
              <Users className="w-12 h-12 mx-auto mb-2" />
              <p>Группы не найдены</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export { EnhancedGroupsSection };
