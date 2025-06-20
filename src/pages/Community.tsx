
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  Plus,
  Shield,
  Sparkles,
  HelpCircle,
  TrendingUp
} from "lucide-react";
import { useSupportGroups } from "@/hooks/useSupportGroups";
import { useCommunityPosts } from "@/hooks/useCommunityPosts";
import { CommunityFeed } from "@/components/community/CommunityFeed";
import { EnhancedGroupsSection } from "@/components/community/EnhancedGroupsSection";
import { QASection } from "@/components/community/QASection";
import { CreateGroupModal } from "@/components/community/CreateGroupModal";
import { CreatePostModal } from "@/components/community/CreatePostModal";

const Community = () => {
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const { data: supportGroups } = useSupportGroups();
  const { data: posts } = useCommunityPosts();

  const totalMembers = supportGroups?.reduce((sum, group) => sum + (group.member_count || 0), 0) || 0;
  const activeDiscussions = posts?.length || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Heart className="w-8 h-8 text-pink-500" />
            <h1 className="text-4xl font-bold font-montserrat bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Женское Сообщество
            </h1>
          </div>
          <p className="text-gray-600 max-w-3xl mx-auto font-roboto text-lg">
            Тёплое и безопасное пространство для поддержки, обмена опытом и взаимопомощи. 
            Здесь каждая женщина найдёт понимание, заботу и ответы на важные вопросы о здоровье и жизни.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-white/70 backdrop-blur-sm border-pink-200 hover:bg-white/80 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl">
                  <Users className="w-6 h-6 text-pink-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-roboto">Активных групп</p>
                  <p className="text-2xl font-bold text-pink-600 font-montserrat">
                    {supportGroups?.length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-purple-200 hover:bg-white/80 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-roboto">Обсуждений</p>
                  <p className="text-2xl font-bold text-purple-600 font-montserrat">
                    {activeDiscussions}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-indigo-200 hover:bg-white/80 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl">
                  <Heart className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-roboto">Участниц</p>
                  <p className="text-2xl font-bold text-indigo-600 font-montserrat">
                    {totalMembers}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-green-200 hover:bg-white/80 transition-all duration-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl">
                  <Sparkles className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600 font-roboto">Онлайн сейчас</p>
                  <p className="text-2xl font-bold text-green-600 font-montserrat">
                    {Math.floor(totalMembers * 0.12)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="feed" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-white/80 backdrop-blur-sm border border-pink-200">
            <TabsTrigger value="feed" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <TrendingUp className="w-4 h-4" />
              <span>Лента активности</span>
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <Users className="w-4 h-4" />
              <span>Группы поддержки</span>
            </TabsTrigger>
            <TabsTrigger value="qa" className="flex items-center space-x-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white">
              <HelpCircle className="w-4 h-4" />
              <span>Вопросы и ответы</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold font-montserrat">Лента сообщества</h2>
              <Button 
                onClick={() => setIsCreatePostOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать пост
              </Button>
            </div>
            <CommunityFeed />
          </TabsContent>

          <TabsContent value="groups" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold font-montserrat">Группы поддержки</h2>
              <Button 
                onClick={() => setIsCreateGroupOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <Plus className="w-4 h-4 mr-2" />
                Создать группу
              </Button>
            </div>
            <EnhancedGroupsSection />
          </TabsContent>

          <TabsContent value="qa" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold font-montserrat">Вопросы и ответы</h2>
              <Button 
                onClick={() => setIsCreatePostOpen(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600"
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Задать вопрос
              </Button>
            </div>
            <QASection />
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
