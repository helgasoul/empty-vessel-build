
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Users, 
  Heart, 
  MessageCircle, 
  UserPlus,
  Shield,
  Sparkles
} from "lucide-react";
import { SupportGroup } from "@/hooks/useSupportGroups";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface SupportGroupCardProps {
  group: SupportGroup;
}

export const SupportGroupCard: React.FC<SupportGroupCardProps> = ({ group }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'health_condition':
        return Heart;
      case 'lifestyle':
        return Sparkles;
      case 'age_group':
        return Users;
      case 'interest':
        return MessageCircle;
      default:
        return Users;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'health_condition':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'lifestyle':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'age_group':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'interest':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const CategoryIcon = getCategoryIcon(group.category);

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-lg transition-all duration-200 hover:border-pink-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback className="bg-gradient-to-br from-pink-100 to-purple-100">
                <CategoryIcon className="w-4 h-4 text-pink-600" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg font-montserrat line-clamp-1">
                {group.name}
              </CardTitle>
              <div className="flex items-center space-x-2 mt-1">
                <Shield className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">Анонимная группа</span>
              </div>
            </div>
          </div>
          <Badge className={getCategoryColor(group.category)}>
            {group.category === 'health_condition' && 'Здоровье'}
            {group.category === 'lifestyle' && 'Образ жизни'}
            {group.category === 'age_group' && 'Возраст'}
            {group.category === 'interest' && 'Интересы'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {group.description && (
          <CardDescription className="font-roboto line-clamp-3">
            {group.description}
          </CardDescription>
        )}

        {group.tags && group.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {group.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {group.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{group.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{group.member_count || 0} участниц</span>
            </div>
          </div>
          <span>
            {formatDistanceToNow(new Date(group.created_at), { 
              addSuffix: true, 
              locale: ru 
            })}
          </span>
        </div>

        <div className="flex space-x-2">
          <Button className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
            <UserPlus className="w-4 h-4 mr-2" />
            Присоединиться
          </Button>
          <Button variant="outline" size="sm">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
