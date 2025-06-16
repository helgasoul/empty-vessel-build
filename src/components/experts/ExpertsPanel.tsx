
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Users, Brain, Heart, Baby, Sparkles } from "lucide-react";
import ExpertCard from './ExpertCard';
import { useExperts } from '@/hooks/useExperts';

const ExpertsPanel = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('all');
  const { data: experts, isLoading } = useExperts();

  const specializations = [
    { id: 'all', name: 'Все специальности', icon: Users, count: experts?.length || 0 },
    { id: 'Гинекология', name: 'Гинекология', icon: Baby, count: experts?.filter(e => e.specialization === 'Гинекология').length || 0 },
    { id: 'Маммология', name: 'Маммология', icon: Heart, count: experts?.filter(e => e.specialization === 'Маммология').length || 0 },
    { id: 'Психология', name: 'Психология', icon: Brain, count: experts?.filter(e => e.specialization === 'Психология').length || 0 },
    { id: 'Неврология', name: 'Неврология', icon: Sparkles, count: experts?.filter(e => e.specialization === 'Неврология').length || 0 }
  ];

  const filteredExperts = experts?.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.specialization.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = selectedSpecialization === 'all' || expert.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  }) || [];

  if (isLoading) {
    return (
      <div className="space-y-6">
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
        
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Загрузка экспертов...</div>
        </div>
      </div>
    );
  }

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
                    <ExpertCard 
                      key={expert.id} 
                      expert={{
                        id: expert.id,
                        name: expert.name,
                        specialization: expert.specialization,
                        title: expert.title,
                        experience: expert.experience,
                        avatar: expert.avatar_url || '/placeholder.svg',
                        rating: expert.rating || 0,
                        description: expert.description || '',
                        education: expert.education || [],
                        certifications: expert.certifications || [],
                        blogPostsCount: expert.blog_posts_count || 0,
                        consultation: {
                          available: expert.consultation_available || false,
                          price: expert.consultation_price || 0
                        }
                      }} 
                    />
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
