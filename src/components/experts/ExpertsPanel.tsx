
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Users, Brain, Heart, Baby, Sparkles } from "lucide-react";
import ExpertCard, { Expert } from './ExpertCard';

const ExpertsPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');

  // Данные экспертов (в реальном приложении будут из API)
  const experts: Expert[] = [
    {
      id: '1',
      name: 'Др. Анна Петрова',
      specialization: 'Гинекология',
      title: 'Врач-гинеколог высшей категории',
      experience: 15,
      avatar: '/placeholder.svg',
      rating: 4.9,
      description: 'Специализируется на превентивной гинекологии, планировании беременности и лечении гормональных нарушений. Автор более 50 научных публикаций.',
      education: [
        'РНИМУ им. Н.И. Пирогова, лечебный факультет',
        'Ординатура по акушерству и гинекологии',
        'Повышение квалификации по репродуктологии'
      ],
      certifications: [
        'Сертификат специалиста по гинекологии',
        'Международный сертификат по УЗИ диагностике'
      ],
      blogPostsCount: 23,
      consultation: {
        available: true,
        price: 3500
      }
    },
    {
      id: '2',
      name: 'Др. Мария Соколова',
      specialization: 'Маммология',
      title: 'Врач-маммолог, онколог',
      experience: 12,
      avatar: '/placeholder.svg',
      rating: 4.8,
      description: 'Ведущий специалист по диагностике и лечению заболеваний молочной железы. Специализируется на раннем выявлении онкологических заболеваний.',
      education: [
        'МГМУ им. И.М. Сеченова',
        'Ординатура по онкологии',
        'Специализация по маммологии'
      ],
      certifications: [
        'Сертификат онколога-маммолога',
        'Европейский сертификат по маммографии'
      ],
      blogPostsCount: 18,
      consultation: {
        available: true,
        price: 4000
      }
    },
    {
      id: '3',
      name: 'Др. Елена Козлова',
      specialization: 'Психология',
      title: 'Клинический психолог, психотерапевт',
      experience: 10,
      avatar: '/placeholder.svg',
      rating: 4.9,
      description: 'Специализируется на женской психологии, работе с тревожными расстройствами и поддержке в период планирования беременности.',
      education: [
        'МГУ им. М.В. Ломоносова, факультет психологии',
        'Магистратура по клинической психологии',
        'Обучение гештальт-терапии'
      ],
      certifications: [
        'Сертификат клинического психолога',
        'Диплом по когнитивно-поведенческой терапии'
      ],
      blogPostsCount: 31,
      consultation: {
        available: true,
        price: 2800
      }
    },
    {
      id: '4',
      name: 'Др. Ольга Волкова',
      specialization: 'Неврология',
      title: 'Врач-невролог, специалист по головным болям',
      experience: 14,
      avatar: '/placeholder.svg',
      rating: 4.7,
      description: 'Эксперт по диагностике и лечению мигрени, головных болей напряжения и других неврологических расстройств у женщин.',
      education: [
        'СПбГМУ им. И.П. Павлова',
        'Ординатура по неврологии',
        'Стажировка в Европейском центре головной боли'
      ],
      certifications: [
        'Сертификат невролога',
        'Специализация по цефалгиям'
      ],
      blogPostsCount: 16,
      consultation: {
        available: true,
        price: 3200
      }
    }
  ];

  const specializations = [
    { id: 'all', name: 'Все специальности', icon: Users, count: experts.length },
    { id: 'Гинекология', name: 'Гинекология', icon: Baby, count: experts.filter(e => e.specialization === 'Гинекология').length },
    { id: 'Маммология', name: 'Маммология', icon: Heart, count: experts.filter(e => e.specialization === 'Маммология').length },
    { id: 'Психология', name: 'Психология', icon: Brain, count: experts.filter(e => e.specialization === 'Психология').length },
    { id: 'Неврология', name: 'Неврология', icon: Sparkles, count: experts.filter(e => e.specialization === 'Неврология').length }
  ];

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' || expert.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Users className="w-6 h-6 text-purple-600" />
            <span>Панель экспертов YTime</span>
          </CardTitle>
          <CardDescription>
            Ведущие специалисты в области превентивной медицины, гинекологии, маммологии, психологии и неврологии
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск по имени, специальности или описанию..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
            <TabsList className="grid w-full grid-cols-5">
              {specializations.map((spec) => {
                const IconComponent = spec.icon;
                return (
                  <TabsTrigger key={spec.id} value={spec.id} className="flex items-center space-x-1">
                    <IconComponent className="w-4 h-4" />
                    <span className="hidden sm:inline">{spec.name}</span>
                    <Badge variant="secondary" className="ml-1 text-xs">
                      {spec.count}
                    </Badge>
                  </TabsTrigger>
                );
              })}
            </TabsList>

            {specializations.map((spec) => (
              <TabsContent key={spec.id} value={spec.id} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredExperts.map((expert) => (
                    <ExpertCard key={expert.id} expert={expert} />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {filteredExperts.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Эксперты не найдены
              </h3>
              <p className="text-gray-600">
                Попробуйте изменить критерии поиска или выбрать другую специальность
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpertsPanel;
