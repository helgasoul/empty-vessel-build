
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, BookOpen, Star, Calendar, Users, TrendingUp, Filter } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import BlogPost, { BlogPost as BlogPostType } from './BlogPost';

const ExpertBlog = () => {
  const { expertId } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Данные эксперта и его блога (в реальном приложении из API)
  const expert = {
    id: expertId,
    name: 'Др. Анна Петрова',
    specialization: 'Гинекология',
    title: 'Врач-гинеколог высшей категории',
    avatar: '/placeholder.svg',
    rating: 4.9,
    followers: 2847,
    totalPosts: 23,
    bio: 'Специализируется на превентивной гинекологии, планировании беременности и лечении гормональных нарушений. Автор более 50 научных публикаций.'
  };

  const blogPosts: BlogPostType[] = [
    {
      id: '1',
      title: 'Превентивная гинекология: основные принципы здоровья женщины',
      excerpt: 'Рассказываем о том, как поддерживать женское здоровье и предотвращать заболевания с помощью профилактических мер.',
      content: '',
      author: {
        id: expert.id || '1',
        name: expert.name,
        avatar: expert.avatar,
        specialization: expert.specialization
      },
      publishedAt: '2024-12-10',
      readTime: 8,
      views: 1240,
      likes: 89,
      tags: ['превентивная медицина', 'женское здоровье', 'профилактика'],
      category: 'Превентивная медицина',
      featured: true
    },
    {
      id: '2',
      title: 'Планирование беременности: пошаговое руководство',
      excerpt: 'Подробный план подготовки к беременности, включающий анализы, витамины и изменения образа жизни.',
      content: '',
      author: {
        id: expert.id || '1',
        name: expert.name,
        avatar: expert.avatar,
        specialization: expert.specialization
      },
      publishedAt: '2024-12-05',
      readTime: 12,
      views: 890,
      likes: 67,
      tags: ['беременность', 'планирование', 'фолиевая кислота'],
      category: 'Репродуктивное здоровье',
      featured: false
    },
    {
      id: '3',
      title: 'Гормональные изменения после 35: что нужно знать',
      excerpt: 'Объясняем, какие гормональные изменения происходят в организме женщины после 35 лет и как с ними справляться.',
      content: '',
      author: {
        id: expert.id || '1',
        name: expert.name,
        avatar: expert.avatar,
        specialization: expert.specialization
      },
      publishedAt: '2024-11-28',
      readTime: 6,
      views: 1560,
      likes: 112,
      tags: ['гормоны', 'возрастные изменения', 'здоровье после 35'],
      category: 'Гормональное здоровье',
      featured: false
    },
    {
      id: '4',
      title: 'Стресс и женское здоровье: взаимосвязь и методы профилактики',
      excerpt: 'Изучаем влияние стресса на репродуктивную систему и делимся эффективными методами борьбы со стрессом.',
      content: '',
      author: {
        id: expert.id || '1',
        name: expert.name,
        avatar: expert.avatar,
        specialization: expert.specialization
      },
      publishedAt: '2024-11-20',
      readTime: 7,
      views: 720,
      likes: 45,
      tags: ['стресс', 'психологическое здоровье', 'репродукция'],
      category: 'Психосоматика',
      featured: false
    }
  ];

  const categories = [
    { id: 'all', name: 'Все категории', count: blogPosts.length },
    { id: 'Превентивная медицина', name: 'Превентивная медицина', count: blogPosts.filter(p => p.category === 'Превентивная медицина').length },
    { id: 'Репродуктивное здоровье', name: 'Репродуктивное здоровье', count: blogPosts.filter(p => p.category === 'Репродуктивное здоровье').length },
    { id: 'Гормональное здоровье', name: 'Гормональное здоровье', count: blogPosts.filter(p => p.category === 'Гормональное здоровье').length },
    { id: 'Психосоматика', name: 'Психосоматика', count: blogPosts.filter(p => p.category === 'Психосоматика').length }
  ];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = filteredPosts.filter(post => !post.featured);

  const expertInitials = expert.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <div className="space-y-6">
      {/* Expert Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-20 h-20">
              <AvatarImage src={expert.avatar} alt={expert.name} />
              <AvatarFallback className="text-xl font-semibold bg-gradient-to-r from-purple-100 to-blue-100">
                {expertInitials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <CardTitle className="text-2xl">{expert.name}</CardTitle>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  {expert.specialization}
                </Badge>
              </div>
              <CardDescription className="text-base mb-3">
                {expert.title}
              </CardDescription>
              <p className="text-gray-700 mb-4">{expert.bio}</p>
              
              <div className="flex items-center space-x-6 text-sm">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{expert.rating}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span>{expert.followers} подписчиков</span>
                </div>
                <div className="flex items-center space-x-1">
                  <BookOpen className="w-4 h-4 text-green-600" />
                  <span>{expert.totalPosts} статей</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <Button className="w-full md:w-auto">
                Подписаться
              </Button>
              <Button variant="outline" className="w-full md:w-auto">
                Консультация
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Featured Post */}
      {featuredPost && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            <span>Рекомендуемая статья</span>
          </h2>
          <BlogPost post={featuredPost} variant="featured" />
        </div>
      )}

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Поиск статей..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="md:w-auto">
              <Filter className="w-4 h-4 mr-2" />
              Фильтры
            </Button>
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-5">
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="text-xs md:text-sm">
                  {category.name}
                  <Badge variant="secondary" className="ml-1 text-xs">
                    {category.count}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category.id} value={category.id} className="mt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularPosts.map((post) => (
                    <BlogPost key={post.id} post={post} variant="card" />
                  ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>

          {filteredPosts.length === 0 && (
            <div className="text-center py-8">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Статьи не найдены
              </h3>
              <p className="text-gray-600">
                Попробуйте изменить критерии поиска или выбрать другую категорию
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Back to Experts */}
      <div className="text-center">
        <Button asChild variant="outline">
          <Link to="/experts">
            ← Вернуться к экспертам
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default ExpertBlog;
