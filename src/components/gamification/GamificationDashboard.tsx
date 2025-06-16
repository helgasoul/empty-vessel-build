
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Trophy, Target, Flame } from "lucide-react";
import { useAchievements, useUserAchievements } from "@/hooks/useAchievements";
import { useHealthHabits } from "@/hooks/useHealthHabits";
import UserLevelCard from "./UserLevelCard";
import AchievementCard from "./AchievementCard";
import HabitCard from "./HabitCard";
import CreateHabitModal from "./CreateHabitModal";

const GamificationDashboard = () => {
  const [createHabitOpen, setCreateHabitOpen] = useState(false);
  
  const { data: achievements = [], isLoading: achievementsLoading } = useAchievements();
  const { data: userAchievements = [], isLoading: userAchievementsLoading } = useUserAchievements();
  const { data: healthHabits = [], isLoading: habitsLoading } = useHealthHabits();

  const completedAchievements = userAchievements.filter(ua => ua.is_completed);
  const inProgressAchievements = userAchievements.filter(ua => !ua.is_completed && (ua.progress || 0) > 0);
  const availableAchievements = achievements.filter(a => 
    !userAchievements.some(ua => ua.achievement_id === a.id)
  );

  return (
    <div className="space-y-6">
      {/* User Level Card */}
      <UserLevelCard />

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="prevent-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">{completedAchievements.length}</div>
                <div className="text-sm text-gray-600">Достижений получено</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="prevent-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">{healthHabits.length}</div>
                <div className="text-sm text-gray-600">Активных привычек</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="prevent-card">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-orange-100 rounded-full">
                <Flame className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-lg font-semibold">
                  {Math.max(...healthHabits.map(h => h.current_streak || 0), 0)}
                </div>
                <div className="text-sm text-gray-600">Лучшая серия</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="habits" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="habits" className="font-roboto">Мои привычки</TabsTrigger>
          <TabsTrigger value="achievements" className="font-roboto">Достижения</TabsTrigger>
        </TabsList>

        <TabsContent value="habits" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold font-montserrat">Здоровые привычки</h3>
            <Button 
              onClick={() => setCreateHabitOpen(true)}
              size="sm"
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-1" />
              Добавить привычку
            </Button>
          </div>

          {habitsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="prevent-card">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : healthHabits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {healthHabits.map((habit) => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
            </div>
          ) : (
            <Card className="prevent-card">
              <CardContent className="p-8 text-center">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2 font-montserrat">Нет активных привычек</h3>
                <p className="text-gray-600 mb-4 font-roboto">
                  Создайте свою первую здоровую привычку и начните зарабатывать очки!
                </p>
                <Button onClick={() => setCreateHabitOpen(true)}>
                  <Plus className="w-4 h-4 mr-1" />
                  Создать первую привычку
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="achievements" className="space-y-4">
          <h3 className="text-lg font-semibold font-montserrat">Достижения</h3>

          {achievementsLoading || userAchievementsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="prevent-card">
                  <CardContent className="p-6">
                    <div className="animate-pulse space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-2 bg-gray-200 rounded"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Completed Achievements */}
              {completedAchievements.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-600 mb-3 font-montserrat">
                    🏆 Полученные достижения ({completedAchievements.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {completedAchievements.map((userAchievement) => (
                      <AchievementCard
                        key={userAchievement.id}
                        achievement={userAchievement.achievement}
                        userAchievement={userAchievement}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* In Progress Achievements */}
              {inProgressAchievements.length > 0 && (
                <div>
                  <h4 className="font-medium text-blue-600 mb-3 font-montserrat">
                    🎯 В процессе выполнения ({inProgressAchievements.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {inProgressAchievements.map((userAchievement) => (
                      <AchievementCard
                        key={userAchievement.id}
                        achievement={userAchievement.achievement}
                        userAchievement={userAchievement}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Available Achievements */}
              {availableAchievements.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-600 mb-3 font-montserrat">
                    📋 Доступные достижения ({availableAchievements.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {availableAchievements.map((achievement) => (
                      <AchievementCard
                        key={achievement.id}
                        achievement={achievement}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>

      <CreateHabitModal 
        open={createHabitOpen} 
        onOpenChange={setCreateHabitOpen} 
      />
    </div>
  );
};

export default GamificationDashboard;
