
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  HelpCircle, 
  CheckCircle, 
  Heart, 
  MessageCircle, 
  Search,
  BookOpen,
  Star,
  Bookmark,
  ThumbsUp
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

const QASection = () => {
  const [searchQuery, setSearchQuery] = useState('');

  // Моковые данные для Q&A
  const questions = [
    {
      id: '1',
      question: 'Нормально ли чувствовать усталость во время овуляции?',
      description: 'Каждый месяц в период овуляции я чувствую сильную усталость. Это нормально или стоит обратиться к врачу?',
      author: 'Мария_28',
      createdAt: new Date('2024-06-18'),
      answers: 12,
      likes: 8,
      hasVerifiedAnswer: true,
      tags: ['овуляция', 'усталость', 'цикл'],
      category: 'hormones'
    },
    {
      id: '2',
      question: 'Как справиться с тревожностью перед важными анализами?',
      description: 'Завтра иду сдавать анализы на гормоны, очень волнуюсь. Какие техники помогают вам успокоиться?',
      author: 'Анна_К',
      createdAt: new Date('2024-06-19'),
      answers: 7,
      likes: 15,
      hasVerifiedAnswer: false,
      tags: ['тревожность', 'анализы', 'поддержка'],
      category: 'mental_health'
    },
    {
      id: '3',
      question: 'Витамин D во время планирования беременности',
      description: 'Врач назначил витамин D, но дозировка кажется большой. У кого был похожий опыт?',
      author: 'Света_мама',
      createdAt: new Date('2024-06-17'),
      answers: 18,
      likes: 12,
      hasVerifiedAnswer: true,
      tags: ['планирование', 'витамины', 'беременность'],
      category: 'pregnancy'
    }
  ];

  const popularAnswers = [
    {
      id: '1',
      question: 'Лучшие приложения для отслеживания цикла?',
      excerpt: 'Проверенный ответ от гинеколога о том, какие приложения действительно помогают...',
      doctorName: 'Др. Анна Иванова',
      specialty: 'Гинеколог',
      savedCount: 234,
      helpfulCount: 89
    },
    {
      id: '2',
      question: 'Что делать при нерегулярном цикле?',
      excerpt: 'Подробный гайд о причинах нерегулярности и когда нужно обращаться к врачу...',
      doctorName: 'Др. Елена Петрова',
      specialty: 'Эндокринолог',
      savedCount: 178,
      helpfulCount: 67
    }
  ];

  return (
    <div className="space-y-6">
      {/* Поиск */}
      <Card className="bg-white/80 backdrop-blur-sm border-pink-100">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Поиск вопросов и ответов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 border-pink-200 focus:border-pink-300"
            />
          </div>
        </CardContent>
      </Card>

      {/* Популярные ответы врачей */}
      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <CardTitle className="font-montserrat text-green-800">Проверенные ответы врачей</CardTitle>
          </div>
          <CardDescription className="font-roboto">
            Самые полезные ответы от сертифицированных специалистов
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {popularAnswers.map((answer) => (
            <div key={answer.id} className="bg-white/80 rounded-lg p-4 border border-green-100">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-900 flex-1">{answer.question}</h4>
                <Button variant="ghost" size="sm">
                  <Bookmark className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 mb-3 font-roboto">{answer.excerpt}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Avatar className="w-6 h-6">
                    <AvatarFallback className="bg-green-100 text-green-700 text-xs">
                      {answer.doctorName.split(' ')[1]?.[0] || 'Д'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-xs">
                    <span className="font-medium text-green-700">{answer.doctorName}</span>
                    <span className="text-gray-500 ml-1">• {answer.specialty}</span>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Проверено
                  </Badge>
                </div>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <span className="flex items-center">
                    <Bookmark className="w-3 h-3 mr-1" />
                    {answer.savedCount}
                  </span>
                  <span className="flex items-center">
                    <ThumbsUp className="w-3 h-3 mr-1" />
                    {answer.helpfulCount}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Список вопросов */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold font-montserrat">Новые вопросы</h2>
          <Button className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
            <HelpCircle className="w-4 h-4 mr-2" />
            Задать вопрос
          </Button>
        </div>

        {questions.map((question) => (
          <Card key={question.id} className="bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-md transition-all duration-200">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-pink-100 to-purple-100 text-sm">
                          {question.author.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <span className="font-medium text-gray-900">{question.author}</span>
                        <span className="text-sm text-gray-500 ml-2">
                          {formatDistanceToNow(question.createdAt, { addSuffix: true, locale: ru })}
                        </span>
                      </div>
                      {question.hasVerifiedAnswer && (
                        <Badge className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Есть ответ врача
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 mb-2">{question.question}</h3>
                    <p className="text-sm text-gray-600 font-roboto mb-3">{question.description}</p>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {question.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-pink-200">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{question.answers}</span>
                    </Button>
                    <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{question.likes}</span>
                    </Button>
                  </div>
                  <Button variant="ghost" size="sm" className="text-pink-600 hover:text-pink-700">
                    Ответить
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export { QASection };
