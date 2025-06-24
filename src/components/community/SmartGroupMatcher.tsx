import React, { useState, useEffect } from 'react';
import { Users, Heart, Shield, Lightbulb, UserPlus, Clock, MapPin, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface CommunityUser {
  id: string;
  anonymousHandle: string;
  emotionalProfile: {
    anxietyLevel: 1 | 2 | 3 | 4 | 5;
    supportNeeded: string[];
    communicationStyle: 'direct' | 'gentle' | 'fact-based' | 'emotional';
    triggers: string[];
    copingMechanisms: string[];
  };
  healthConcerns: HealthConcern[];
  demographics: {
    ageRange: string;
    location: string;
    timeZone: string;
    availableHours: string[];
  };
  supportRole: 'seeker' | 'giver' | 'both';
  joinDate: Date;
  lastActive: Date;
}

interface HealthConcern {
  category: 'breast-cancer' | 'cardiovascular' | 'menopause' | 'fertility' | 'mental-health' | 'general-wellness';
  level: 'low-risk' | 'moderate-risk' | 'high-risk' | 'diagnosed' | 'survivor';
  priority: 1 | 2 | 3;
}

interface SupportGroup {
  id: string;
  name: string;
  type: 'circle-of-trust' | 'diagnosis-support' | 'life-stage' | 'expert-qa' | 'crisis-support';
  description: string;
  currentMembers: CommunityUser[];
  maxMembers: number;
  moderator: {
    name: string;
    type: 'professional' | 'peer' | 'volunteer';
    credentials?: string;
  };
  schedule: {
    frequency: 'weekly' | 'bi-weekly' | 'monthly';
    dayOfWeek: string;
    timeSlot: string;
    duration: number; // minutes
    timezone: string;
  };
  tags: string[];
  privacyLevel: 'open' | 'invite-only' | 'application-required';
  healthFocus: string[];
  communicationStyle: string[];
  created: Date;
  groupHealth: {
    participationRate: number;
    emotionalSafety: number;
    supportQuality: number;
  };
}

interface MatchingCriteria {
  healthConcerns: string[];
  ageRange: string;
  communicationStyle: string;
  supportType: string;
  timePreference: string;
  groupSize: 'small' | 'medium' | 'large';
  professionalModeration: boolean;
}

interface MatchingResult {
  group: SupportGroup;
  compatibilityScore: number;
  matchReasons: string[];
  potentialChallenges: string[];
}

const SmartGroupMatcher: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<CommunityUser | null>(null);
  const [matchingCriteria, setMatchingCriteria] = useState<MatchingCriteria>({
    healthConcerns: [],
    ageRange: '',
    communicationStyle: '',
    supportType: '',
    timePreference: '',
    groupSize: 'small',
    professionalModeration: false
  });
  const [availableGroups, setAvailableGroups] = useState<SupportGroup[]>([]);
  const [matchingResults, setMatchingResults] = useState<MatchingResult[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Initialize with mock data
  useEffect(() => {
    const mockUser: CommunityUser = {
      id: '1',
      anonymousHandle: 'Надежда_78',
      emotionalProfile: {
        anxietyLevel: 3,
        supportNeeded: ['эмоциональная поддержка', 'информация', 'мотивация'],
        communicationStyle: 'gentle',
        triggers: ['медицинские термины', 'статистика'],
        copingMechanisms: ['дыхательные упражнения', 'медитация']
      },
      healthConcerns: [
        { category: 'breast-cancer', level: 'high-risk', priority: 1 },
        { category: 'cardiovascular', level: 'moderate-risk', priority: 2 }
      ],
      demographics: {
        ageRange: '35-44',
        location: 'Москва',
        timeZone: 'Europe/Moscow',
        availableHours: ['18:00-21:00', 'weekend-morning']
      },
      supportRole: 'seeker',
      joinDate: new Date('2024-01-15'),
      lastActive: new Date()
    };

    const mockGroups: SupportGroup[] = [
      {
        id: '1',
        name: 'Круг доверия "Розовые надежды"',
        type: 'circle-of-trust',
        description: 'Безопасное пространство для женщин с повышенными рисками рака молочной железы. Мы поддерживаем друг друга с теплотой и пониманием.',
        currentMembers: [],
        maxMembers: 12,
        moderator: {
          name: 'Анна Петрова',
          type: 'professional',
          credentials: 'Психолог-онколог, 8 лет опыта'
        },
        schedule: {
          frequency: 'weekly',
          dayOfWeek: 'Вторник',
          timeSlot: '19:00-20:30',
          duration: 90,
          timezone: 'Europe/Moscow'
        },
        tags: ['высокий риск', 'рак молочной железы', 'эмоциональная поддержка', 'анонимно'],
        privacyLevel: 'invite-only',
        healthFocus: ['breast-cancer'],
        communicationStyle: ['gentle', 'emotional'],
        created: new Date('2024-01-01'),
        groupHealth: {
          participationRate: 85,
          emotionalSafety: 92,
          supportQuality: 88
        }
      },
      {
        id: '2',
        name: 'Женщины за здоровое сердце',
        type: 'diagnosis-support',
        description: 'Обсуждаем профилактику сердечно-сосудистых заболеваний, делимся опытом здорового образа жизни.',
        currentMembers: [],
        maxMembers: 20,
        moderator: {
          name: 'Елена Волкова',
          type: 'professional',
          credentials: 'Кардиолог, КМН'
        },
        schedule: {
          frequency: 'bi-weekly',
          dayOfWeek: 'Четверг',
          timeSlot: '18:30-20:00',
          duration: 90,
          timezone: 'Europe/Moscow'
        },
        tags: ['сердце', 'профилактика', 'здоровый образ жизни', 'врач'],
        privacyLevel: 'open',
        healthFocus: ['cardiovascular'],
        communicationStyle: ['fact-based', 'direct'],
        created: new Date('2024-02-01'),
        groupHealth: {
          participationRate: 78,
          emotionalSafety: 85,
          supportQuality: 82
        }
      },
      {
        id: '3',
        name: 'Менопауза: новая глава жизни',
        type: 'life-stage',
        description: 'Поддержка женщин в период менопаузы. Обсуждаем изменения в организме, способы заботы о себе.',
        currentMembers: [],
        maxMembers: 15,
        moderator: {
          name: 'Мария Смирнова',
          type: 'peer',
          credentials: 'Опытная участница, 3 года в сообществе'
        },
        schedule: {
          frequency: 'weekly',
          dayOfWeek: 'Суббота',
          timeSlot: '11:00-12:30',
          duration: 90,
          timezone: 'Europe/Moscow'
        },
        tags: ['менопауза', 'гормоны', 'возрастные изменения', 'самочувствие'],
        privacyLevel: 'open',
        healthFocus: ['menopause', 'general-wellness'],
        communicationStyle: ['gentle', 'emotional'],
        created: new Date('2024-01-15'),
        groupHealth: {
          participationRate: 90,
          emotionalSafety: 95,
          supportQuality: 91
        }
      }
    ];

    setCurrentUser(mockUser);
    setAvailableGroups(mockGroups);
  }, []);

  // Smart matching algorithm
  const calculateGroupCompatibility = (user: CommunityUser, group: SupportGroup): MatchingResult => {
    let score = 0;
    const matchReasons: string[] = [];
    const potentialChallenges: string[] = [];

    // Health concerns overlap (40% weight)
    const healthOverlap = user.healthConcerns.filter(concern => 
      group.healthFocus.includes(concern.category)
    ).length;
    if (healthOverlap > 0) {
      const healthScore = (healthOverlap / user.healthConcerns.length) * 40;
      score += healthScore;
      matchReasons.push(`Совпадают проблемы здоровья: ${healthOverlap} из ${user.healthConcerns.length}`);
    }

    // Communication style compatibility (25% weight)
    if (group.communicationStyle.includes(user.emotionalProfile.communicationStyle)) {
      score += 25;
      matchReasons.push(`Подходящий стиль общения: ${user.emotionalProfile.communicationStyle}`);
    } else {
      potentialChallenges.push('Разный стиль общения может потребовать адаптации');
    }

    // Group size preference (15% weight)
    const sizeScore = getSizeCompatibilityScore(group.currentMembers.length, group.maxMembers);
    score += sizeScore * 15;
    if (sizeScore > 0.7) {
      matchReasons.push('Оптимальный размер группы для комфортного общения');
    }

    // Schedule compatibility (10% weight)
    const scheduleCompatible = isScheduleCompatible(user, group);
    if (scheduleCompatible) {
      score += 10;
      matchReasons.push('Удобное время встреч');
    } else {
      potentialChallenges.push('Время встреч может не подходить вашему расписанию');
    }

    // Group health metrics (10% weight)
    const healthMetrics = (group.groupHealth.participationRate + 
                          group.groupHealth.emotionalSafety + 
                          group.groupHealth.supportQuality) / 3;
    score += (healthMetrics / 100) * 10;
    if (healthMetrics > 85) {
      matchReasons.push('Высокие показатели активности и безопасности группы');
    }

    return {
      group,
      compatibilityScore: Math.min(score, 100),
      matchReasons,
      potentialChallenges
    };
  };

  const getSizeCompatibilityScore = (current: number, max: number): number => {
    const ratio = current / max;
    // Optimal ratio is around 0.6-0.8 (60-80% capacity)
    if (ratio >= 0.6 && ratio <= 0.8) return 1.0;
    if (ratio >= 0.4 && ratio <= 0.9) return 0.8;
    if (ratio >= 0.2 && ratio <= 0.95) return 0.6;
    return 0.3;
  };

  const isScheduleCompatible = (user: CommunityUser, group: SupportGroup): boolean => {
    // Simplified schedule compatibility check
    const userAvailableEvening = user.demographics.availableHours.includes('18:00-21:00');
    const userAvailableWeekend = user.demographics.availableHours.some(hour => 
      hour.includes('weekend')
    );
    
    const groupTime = group.schedule.timeSlot;
    const isEvening = groupTime.includes('18:') || groupTime.includes('19:') || groupTime.includes('20:');
    const isWeekend = group.schedule.dayOfWeek === 'Суббота' || group.schedule.dayOfWeek === 'Воскресенье';
    
    return (isEvening && userAvailableEvening) || (isWeekend && userAvailableWeekend);
  };

  const findMatches = async () => {
    if (!currentUser) return;
    
    setIsMatching(true);
    
    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const results = availableGroups.map(group => 
      calculateGroupCompatibility(currentUser, group)
    ).sort((a, b) => b.compatibilityScore - a.compatibilityScore);
    
    setMatchingResults(results);
    setIsMatching(false);
  };

  const getGroupIcon = (type: SupportGroup['type']) => {
    switch (type) {
      case 'circle-of-trust': return <Heart className="w-5 h-5 text-pink-500" />;
      case 'diagnosis-support': return <Shield className="w-5 h-5 text-purple-500" />;
      case 'life-stage': return <Users className="w-5 h-5 text-blue-500" />;
      case 'expert-qa': return <Lightbulb className="w-5 h-5 text-yellow-500" />;
      case 'crisis-support': return <Heart className="w-5 h-5 text-red-500" />;
      default: return <Users className="w-5 h-5" />;
    }
  };

  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    if (score >= 40) return 'text-orange-600';
    return 'text-red-600';
  };

  const getCompatibilityBg = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-yellow-50 border-yellow-200';
    if (score >= 40) return 'bg-orange-50 border-orange-200';
    return 'bg-red-50 border-red-200';
  };

  const joinGroup = (groupId: string) => {
    // Handle group joining logic
    console.log('Joining group:', groupId);
  };

  const requestInvite = (groupId: string) => {
    // Handle invite request logic
    console.log('Requesting invite for group:', groupId);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Умный подбор групп поддержки
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Найдите группу, которая подходит именно вам. Наш алгоритм учитывает ваши потребности, стиль общения и расписание.
        </p>
      </div>

      {/* User Profile Summary */}
      {currentUser && (
        <Card className="border-pink-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-pink-500" />
              Ваш профиль для подбора
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Основные заботы</h4>
                <div className="space-y-1">
                  {currentUser.healthConcerns.map((concern, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {concern.category} ({concern.level})
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Стиль общения</h4>
                <Badge className="bg-purple-100 text-purple-800">
                  {currentUser.emotionalProfile.communicationStyle}
                </Badge>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Уровень тревожности</h4>
                <div className="flex items-center gap-2">
                  <Progress value={currentUser.emotionalProfile.anxietyLevel * 20} className="h-2" />
                  <span className="text-sm text-gray-600">{currentUser.emotionalProfile.anxietyLevel}/5</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Доступное время</h4>
                <div className="text-sm text-gray-600">
                  {currentUser.demographics.availableHours.join(', ')}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Matching Controls */}
      <Card className="border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-500" />
              Критерии подбора
            </span>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="border-blue-300"
            >
              {showFilters ? 'Скрыть фильтры' : 'Настроить фильтры'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {showFilters && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <label className="text-sm font-medium mb-2 block">Тип поддержки</label>
                <Select value={matchingCriteria.supportType} onValueChange={(value) => 
                  setMatchingCriteria(prev => ({...prev, supportType: value}))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Выберите тип" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emotional">Эмоциональная поддержка</SelectItem>
                    <SelectItem value="informational">Информационная</SelectItem>
                    <SelectItem value="practical">Практическая помощь</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Размер группы</label>
                <Select value={matchingCriteria.groupSize} onValueChange={(value: 'small' | 'medium' | 'large') => 
                  setMatchingCriteria(prev => ({...prev, groupSize: value}))
                }>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="small">Малая (6-10 человек)</SelectItem>
                    <SelectItem value="medium">Средняя (11-15 человек)</SelectItem>
                    <SelectItem value="large">Большая (16+ человек)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="professional"
                  checked={matchingCriteria.professionalModeration}
                  onCheckedChange={(checked) => 
                    setMatchingCriteria(prev => ({...prev, professionalModeration: !!checked}))
                  }
                />
                <label htmlFor="professional" className="text-sm">
                  Профессиональная модерация
                </label>
              </div>
            </div>
          )}
          
          <Button 
            onClick={findMatches}
            disabled={isMatching}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white"
          >
            {isMatching ? 'Ищем подходящие группы...' : 'Найти мои группы'}
          </Button>
        </CardContent>
      </Card>

      {/* Matching Results */}
      {matchingResults.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Рекомендуемые группы</h2>
          
          <div className="grid gap-6">
            {matchingResults.map((result, index) => (
              <Card key={result.group.id} className={`border-2 ${getCompatibilityBg(result.compatibilityScore)}`}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {getGroupIcon(result.group.type)}
                      <div>
                        <CardTitle className="text-lg">{result.group.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className="bg-gray-100 text-gray-800 text-xs">
                            {result.group.moderator.name}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            {result.group.privacyLevel}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${getCompatibilityColor(result.compatibilityScore)}`}>
                        {Math.round(result.compatibilityScore)}%
                      </div>
                      <div className="text-xs text-gray-600">совместимость</div>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600">
                    {result.group.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Schedule Info */}
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      <span>{result.group.schedule.dayOfWeek} {result.group.schedule.timeSlot}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      <span>{result.group.currentMembers.length}/{result.group.maxMembers} участниц</span>
                    </div>
                  </div>

                  {/* Group Health Metrics */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">
                        {result.group.groupHealth.participationRate}%
                      </div>
                      <div className="text-xs text-gray-600">Активность</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-blue-600">
                        {result.group.groupHealth.emotionalSafety}%
                      </div>
                      <div className="text-xs text-gray-600">Безопасность</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-purple-600">
                        {result.group.groupHealth.supportQuality}%
                      </div>
                      <div className="text-xs text-gray-600">Качество поддержки</div>
                    </div>
                  </div>

                  {/* Match Reasons */}
                  <div className="space-y-2">
                    <h4 className="font-medium text-green-800">Почему подходит:</h4>
                    <ul className="space-y-1">
                      {result.matchReasons.map((reason, idx) => (
                        <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                          <span className="text-green-500 mt-1">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Potential Challenges */}
                  {result.potentialChallenges.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium text-orange-800">На что обратить внимание:</h4>
                      <ul className="space-y-1">
                        {result.potentialChallenges.map((challenge, idx) => (
                          <li key={idx} className="text-sm text-orange-700 flex items-start gap-2">
                            <span className="text-orange-500 mt-1">•</span>
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {result.group.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    {result.group.privacyLevel === 'open' ? (
                      <Button 
                        onClick={() => joinGroup(result.group.id)}
                        className="flex-1 bg-green-500 hover:bg-green-600 text-white"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Присоединиться
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => requestInvite(result.group.id)}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        <UserPlus className="w-4 h-4 mr-2" />
                        Запросить приглашение
                      </Button>
                    )}
                    <Button variant="outline" className="border-gray-300">
                      Подробнее
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Create New Group Option */}
      {matchingResults.length > 0 && matchingResults[0]?.compatibilityScore < 70 && (
        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-purple-500" />
              Не нашли идеальную группу?
            </CardTitle>
            <CardDescription>
              Создайте собственную группу поддержки, и мы поможем найти единомышленниц.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="bg-purple-500 hover:bg-purple-600 text-white">
              Создать свою группу
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SmartGroupMatcher;