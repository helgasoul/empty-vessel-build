
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Search, 
  Plus,
  Filter,
  Sparkles,
  Shield
} from "lucide-react";
import { useSupportGroups } from "@/hooks/useSupportGroups";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { SupportGroupCard } from "@/components/community/SupportGroupCard";
import { CommunityPostCard } from "@/components/community/CommunityPostCard";
import { CreateGroupModal } from "@/components/community/CreateGroupModal";
import { CreatePostModal } from "@/components/community/CreatePostModal";

const Community = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const { data: supportGroups, isLoading: groupsLoading } = useSupportGroups();
  const { data: posts, isLoading: postsLoading } = useCommunityPosts();

  const categories = [
    { id: 'all', name: 'Все', icon: Users },
    { id: 'health_condition', name: 'Здоровье', icon: Heart },
    { id: 'lifestyle', name: 'Образ жизни', icon: Sparkles },
    { id: 'age_group', name: 'Возрастная группа', icon: Users },
    { id: 'interest', name: 'Интересы', icon: MessageCircle }
  ];

  const filteredGroups = supportGroups?.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Shield className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl font-bold font-montserrat bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Женское Сообщество
            </h1>
          </div>
          <p className="text-gray-600 max-w-2xl mx-auto font-roboto">
            Безопасное пространство для анонимного общения, обмена опытом и взаимной поддержки. 
            Здесь каждая женщина может найти понимание и получить помощь.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-white/60 backdrop-blur-sm border-pink-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Users className="w-5 h-5 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Активных групп</p>
                  <p className="text-2xl font-bold text-pink-600">
                    {supportGroups?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-purple-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <MessageCircle className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Обсуждений</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {posts?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-sm border-indigo-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Heart className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Участниц</p>
                  <p className="text-2xl font-bold text-indigo-600">
                    {supportGroups?.reduce((sum, group) => sum + (group.member_count || 0), 0) || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="groups" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="groups" className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>Группы поддержки</span>
            </TabsTrigger>
            <TabsTrigger value="discussions" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Обсуждения</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="groups" className="space-y-6">
            {/* Search and Filter Bar */}
            <Card className="bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Поиск групп..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <Button
                          key={category.id}
                          variant={selectedCategory === category.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedCategory(category.id)}
                          className="flex items-center space-x-1"
                        >
                          <category.icon className="w-3 h-3" />
                          <span>{category.name}</span>
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button 
                    onClick={() => setIsCreateGroupOpen(true)}
                    className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Создать группу
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Groups Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {groupsLoading ? (
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
              ) : filteredGroups?.length ? (
                filteredGroups.map((group) => (
                  <SupportGroupCard key={group.id} group={group} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <Users className="w-12 h-12 mx-auto mb-2" />
                    <p>Группы не найдены</p>
                  </div>
                  <Button 
                    onClick={() => setIsCreateGroupOpen(true)}
                    variant="outline"
                  >
                    Создать первую группу
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="discussions" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold font-montserrat">Последние обсуждения</h2>
              <Button 
                onClick={() => setIsCreatePostOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Новое обсуждение
              </Button>
            </div>

            <div className="space-y-4">
              {postsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <Card key={i} className="animate-pulse bg-white/60">
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-16 bg-gray-200 rounded"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : posts?.length ? (
                posts.map((post) => (
                  <CommunityPostCard key={post.id} post={post} />
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">
                    <MessageCircle className="w-12 h-12 mx-auto mb-2" />
                    <p>Пока нет обсуждений</p>
                  </div>
                  <Button 
                    onClick={() => setIsCreatePostOpen(true)}
                    variant="outline"
                  >
                    Начать первое обсуждение
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <CreateGroupModal 
        isOpen={isCreateGroupOpen} 
        onClose={() => setIsCreateGroupOpen(false)} 
      />
      
      <CreatePostModal 
        isOpen={isCreatePostOpen} 
        onClose={() => setIsCreatePostOpen(false)} 
      />
    </div>
  );
};

export default Community;
