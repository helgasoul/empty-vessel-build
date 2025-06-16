
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  Heart, 
  MessageCircle, 
  Share, 
  MoreHorizontal,
  Shield
} from "lucide-react";
import { CommunityPost } from "@/hooks/useCommunityPosts";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

interface CommunityPostCardProps {
  post: CommunityPost;
}

export const CommunityPostCard: React.FC<CommunityPostCardProps> = ({ post }) => {
  const getPostTypeColor = (type?: string) => {
    switch (type) {
      case 'experience':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'question':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'support':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'discussion':
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPostTypeName = (type?: string) => {
    switch (type) {
      case 'experience':
        return 'Опыт';
      case 'question':
        return 'Вопрос';
      case 'support':
        return 'Поддержка';
      case 'discussion':
      default:
        return 'Обсуждение';
    }
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'from-pink-100 to-rose-100',
      'from-purple-100 to-indigo-100',
      'from-blue-100 to-cyan-100',
      'from-green-100 to-emerald-100',
      'from-yellow-100 to-orange-100'
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-gray-200 hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className={`bg-gradient-to-br ${getAvatarColor(post.anonymous_name)} text-sm font-medium`}>
                {post.anonymous_name.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  {post.anonymous_name}
                </span>
                <Shield className="w-3 h-3 text-gray-400" />
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <span>
                  {formatDistanceToNow(new Date(post.created_at), { 
                    addSuffix: true, 
                    locale: ru 
                  })}
                </span>
                <Badge className={getPostTypeColor(post.post_type)}>
                  {getPostTypeName(post.post_type)}
                </Badge>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {post.title && (
          <CardTitle className="text-lg font-montserrat line-clamp-2">
            {post.title}
          </CardTitle>
        )}

        <CardDescription className="font-roboto line-clamp-4 whitespace-pre-wrap">
          {post.content}
        </CardDescription>

        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <Heart className="w-4 h-4" />
              <span>{post.like_count || 0}</span>
            </Button>
            <Button variant="ghost" size="sm" className="flex items-center space-x-1">
              <MessageCircle className="w-4 h-4" />
              <span>{post.reply_count || 0}</span>
            </Button>
          </div>
          <Button variant="ghost" size="sm">
            <Share className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
