
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Heart, Target, CheckCircle2, Calendar, Sparkles, Trophy, Clock, Star } from "lucide-react";

interface Task {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  timeEstimate: string;
}

interface Goal {
  id: string;
  title: string;
  progress: number;
  target: string;
  category: string;
}

const PersonalPlan = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Записаться на маммографию', category: 'Здоровье', completed: false, priority: 'high', timeEstimate: '15 мин' },
    { id: '2', title: 'Принять витамин D', category: 'Питание', completed: true, priority: 'medium', timeEstimate: '1 мин' },
    { id: '3', title: 'Медитация перед сном', category: 'Благополучие', completed: false, priority: 'low', timeEstimate: '10 мин' },
    { id: '4', title: 'Выпить 2 литра воды', category: 'Образ жизни', completed: false, priority: 'medium', timeEstimate: 'В течение дня' },
    { id: '5', title: 'Прогулка 30 минут', category: 'Активность', completed: true, priority: 'high', timeEstimate: '30 мин' }
  ]);

  const [goals] = useState<Goal[]>([
    { id: '1', title: 'Снизить уровень стресса', progress: 65, target: '80%', category: 'Благополучие' },
    { id: '2', title: 'Улучшить качество сна', progress: 45, target: '8 часов', category: 'Сон' },
    { id: '3', title: 'Регулярные обследования', progress: 80, target: '100%', category: 'Профилактика' }
  ]);

  const motivationalQuotes = [
    "Забота о себе — это не эгоизм, это самосохранение",
    "Каждый день — новая возможность стать здоровее",
    "Маленькие шаги ведут к большим изменениям",
    "Твоё здоровье — твоя ответственность и твоя сила"
  ];

  const [currentQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  const toggleTask = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const overallProgress = (completedTasks / totalTasks) * 100;

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'medium': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getPriorityText = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'Высокий';
      case 'medium': return 'Средний';
      case 'low': return 'Низкий';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'Здоровье': 'bg-pink-100 text-pink-800',
      'Питание': 'bg-green-100 text-green-800',
      'Благополучие': 'bg-purple-100 text-purple-800',
      'Образ жизни': 'bg-blue-100 text-blue-800',
      'Активность': 'bg-orange-100 text-orange-800',
      'Сон': 'bg-indigo-100 text-indigo-800',
      'Профилактика': 'bg-teal-100 text-teal-800'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <section id="personal-plan" className="py-16 px-4 md:px-6 bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="w-8 h-8 text-pink-500 mr-3" aria-hidden="true" />
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Персональный план
            </h2>
          </div>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            Твой индивидуальный план заботы о здоровье, созданный специально для тебя
          </p>
        </div>

        {/* Progress Overview */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-pink-100 to-purple-100 border-pink-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Trophy className="w-6 h-6 text-pink-600" aria-hidden="true" />
                  <h3 className="text-xl font-semibold text-gray-900">Общий прогресс</h3>
                </div>
                <Badge className="bg-pink-200 text-pink-800 font-medium">
                  {completedTasks} из {totalTasks} задач
                </Badge>
              </div>
              <Progress 
                value={overallProgress} 
                className="w-full h-3 bg-pink-200"
                aria-label={`Прогресс выполнения задач: ${Math.round(overallProgress)}%`}
              />
              <p className="text-sm text-gray-600 mt-2">
                Отличная работа! Ты выполнила {Math.round(overallProgress)}% задач на сегодня
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Motivational Quote */}
        <div className="mb-8">
          <Card className="bg-gradient-to-r from-purple-100 to-indigo-100 border-purple-200">
            <CardContent className="p-6 text-center">
              <Sparkles className="w-6 h-6 text-purple-600 mx-auto mb-3" aria-hidden="true" />
              <blockquote className="text-lg font-medium text-gray-800 italic">
                "{currentQuote}"
              </blockquote>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Goals Section */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-purple-200 h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-purple-800">
                  <Target className="w-5 h-5" aria-hidden="true" />
                  <span>Твои цели на месяц</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {goals.map((goal) => (
                  <div key={goal.id} className="p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 transition-all duration-200 hover:shadow-md">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">{goal.title}</h4>
                      <Badge className={getCategoryColor(goal.category)}>
                        {goal.category}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Прогресс</span>
                        <span>{goal.progress}% из {goal.target}</span>
                      </div>
                      <Progress 
                        value={goal.progress} 
                        className="w-full h-2"
                        aria-label={`Прогресс цели ${goal.title}: ${goal.progress}%`}
                      />
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Tasks Section */}
          <div>
            <Card className="bg-white/80 backdrop-blur-sm border-pink-200 h-full">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-pink-800">
                  <Calendar className="w-5 h-5" aria-hidden="true" />
                  <span>Трекер задач</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {tasks.map((task) => (
                  <div 
                    key={task.id} 
                    className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-md cursor-pointer group ${
                      task.completed 
                        ? 'bg-green-50 border-green-200 opacity-75' 
                        : 'bg-white border-gray-200 hover:border-pink-200'
                    }`}
                    onClick={() => toggleTask(task.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleTask(task.id);
                      }
                    }}
                    aria-label={`${task.completed ? 'Отменить выполнение' : 'Отметить как выполненное'} задачи: ${task.title}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="mt-0.5">
                        {task.completed ? (
                          <CheckCircle2 className="w-5 h-5 text-green-600 animate-scale-in" aria-hidden="true" />
                        ) : (
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full group-hover:border-pink-400 transition-colors duration-200" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium transition-all duration-200 ${
                          task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                          {task.title}
                        </h4>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge className={getCategoryColor(task.category)}>
                            {task.category}
                          </Badge>
                          <Badge variant="outline" className={getPriorityColor(task.priority)}>
                            {getPriorityText(task.priority)}
                          </Badge>
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock className="w-3 h-3 mr-1" aria-hidden="true" />
                            {task.timeEstimate}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Daily Recommendations */}
        <div className="mt-8">
          <Card className="bg-gradient-to-r from-mint-100 to-green-100 border-mint-200">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
                <Star className="w-5 h-5" aria-hidden="true" />
                <span>Ежедневные рекомендации</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-white/60 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">🥗 Питание</h4>
                  <p className="text-sm text-gray-700">Добавь в рацион больше листовых овощей и омега-3</p>
                </div>
                <div className="p-4 bg-white/60 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">🧘‍♀️ Релаксация</h4>
                  <p className="text-sm text-gray-700">10 минут дыхательных упражнений помогут снизить стресс</p>
                </div>
                <div className="p-4 bg-white/60 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-900 mb-2">🏃‍♀️ Активность</h4>
                  <p className="text-sm text-gray-700">Сегодня идеальный день для лёгкой пробежки</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="mt-12 text-center">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white px-8 py-4 text-lg font-medium transition-all duration-200 hover:shadow-lg hover:scale-105"
          >
            Настроить план под себя
          </Button>
        </div>
      </div>
    </section>
  );
};

export default PersonalPlan;
