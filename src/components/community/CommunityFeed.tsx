
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Shield,
  Plus,
  TrendingUp,
  Users,
  Sparkles
} from "lucide-react";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { CommunityPostCard } from "./CommunityPostCard";

const CommunityFeed = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const { data: posts, isLoading } = useCommunityPosts();

  const feedFilters = [
    { id: 'all', name: 'Все', icon: Sparkles, color: 'bg-gradient-to-r from-pink-100 to-purple-100' },
    { id: 'mental_health', name: 'Ментальное здоровье', icon: Heart, color: 'bg-gradient-to-r from-green-100 to-teal-100' },
    { id: 'hormones', name: 'Гормоны', icon: TrendingUp, color: 'bg-gradient-to-r from-purple-100 to-indigo-100' },
    { id: 'pregnancy', name: 'Планирование', icon: Users, color: 'bg-gradient-to-r from-pink-100 to-rose-100' },
    { id: 'menopause', name: 'Менопауза', icon: Shield, color: 'bg-gradient-to-r from-orange-100 to-amber-100' }
  ];

  const weeklyPoll = {
    question: "Как вы себя чувствуете на этой фазе цикла?",
    options: [
      { text: "Энергично и позитивно 🌟", votes: 145, percentage: 35 },
      { text: "Немного устало 😴", votes: 98, percentage: 24 },
      { text: "Эмоционально 💭", votes: 87, percentage: 21 },
      { text: "Физически некомфортно 🤗", votes: 82, percentage: 20 }
    ],
    totalVotes: 412
  };

  return (
    <div className="space-y-6">
      {/* Фильтры */}
      <Card className="bg-white/80 backdrop-blur-sm border-pink-100">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            {feedFilters.map((filter) => {
              const FilterIcon = filter.icon;
              return (
                <Button
                  key={filter.id}
                  variant={activeFilter === filter.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(filter.id)}
                  className={`flex items-center space-x-2 ${
                    activeFilter === filter.id 
                      ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white border-0' 
                      : 'border-pink-200 hover:bg-pink-50'
                  }`}
                >
                  <FilterIcon className="w-4 h-4" />
                  <span>{filter.name}</span>
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Еженедельный опрос */}
      <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg font-montserrat">Опрос недели</CardTitle>
              <CardDescription className="font-roboto">
                {weeklyPoll.totalVotes} участниц уже ответили
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <h3 className="font-medium text-gray-900">{weeklyPoll.question}</h3>
          <div className="space-y-3">
            {weeklyPoll.options.map((option, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-roboto">{option.text}</span>
                  <span className="text-sm text-gray-500">{option.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-pink-400 to-purple-400 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${option.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full border-pink-200 hover:bg-pink-50">
            Принять участие в опросе
          </Button>
        </CardContent>
      </Card>

      {/* Лента постов */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="animate-pulse bg-white/60">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full" />
                    <div className="space-y-1">
                      <div className="h-4 bg-gray-200 rounded w-24" />
                      <div className="h-3 bg-gray-200 rounded w-16" />
                    </div>
                  </div>
                  <div className="h-16 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-1/4" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : posts?.length ? (
          posts.map((post) => (
            <CommunityPostCard key={post.id} post={post} />
          ))
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="text-gray-400 mb-4">
                <MessageCircle className="w-12 h-12 mx-auto mb-2" />
                <p className="font-roboto">Пока нет постов в этой категории</p>
                <p className="text-sm mt-1">Будьте первой, кто поделится опытом!</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export { CommunityFeed };
