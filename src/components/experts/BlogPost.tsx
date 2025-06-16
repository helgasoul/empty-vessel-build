
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, Eye, Heart, Share2, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    specialization: string;
  };
  publishedAt: string;
  readTime: number;
  views: number;
  likes: number;
  tags: string[];
  category: string;
  featured: boolean;
}

interface BlogPostProps {
  post: BlogPost;
  variant?: 'card' | 'list' | 'featured';
}

const BlogPost: React.FC<BlogPostProps> = ({ post, variant = 'card' }) => {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const authorInitials = post.author.name.split(' ').map(n => n[0]).join('').toUpperCase();

  if (variant === 'featured') {
    return (
      <Card className="overflow-hidden bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              Рекомендуемая статья
            </Badge>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{post.views}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>{post.likes}</span>
              </div>
            </div>
          </div>
          <CardTitle className="text-2xl line-clamp-2">{post.title}</CardTitle>
          <CardDescription className="text-base line-clamp-3">
            {post.excerpt}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback className="bg-gradient-to-r from-purple-100 to-blue-100">
                  {authorInitials}
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="font-medium">{post.author.name}</div>
                <div className="text-sm text-gray-600">{post.author.specialization}</div>
              </div>
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{post.readTime} мин</span>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4 mr-1" />
                  Поделиться
                </Button>
                <Button asChild size="sm">
                  <Link to={`/experts/blog/${post.id}`}>
                    <BookOpen className="w-4 h-4 mr-1" />
                    Читать
                  </Link>
                </Button>
              </div>
            </div>
          </div>
          
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {post.tags.map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (variant === 'list') {
    return (
      <Card className="hover:shadow-md transition-shadow duration-300">
        <CardContent className="p-4">
          <div className="flex space-x-4">
            <Avatar className="w-12 h-12 flex-shrink-0">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback className="bg-gradient-to-r from-purple-100 to-blue-100">
                {authorInitials}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold line-clamp-2 mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{post.excerpt}</p>
                  
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <span>{post.author.name}</span>
                    <span>{formattedDate}</span>
                    <span>{post.readTime} мин чтения</span>
                  </div>
                </div>
                
                <Button asChild variant="ghost" size="sm" className="ml-4">
                  <Link to={`/experts/blog/${post.id}`}>
                    <BookOpen className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline">{post.category}</Badge>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Eye className="w-4 h-4" />
            <span>{post.views}</span>
          </div>
        </div>
        <CardTitle className="line-clamp-2">{post.title}</CardTitle>
        <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback className="text-xs bg-gradient-to-r from-purple-100 to-blue-100">
                {authorInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="text-sm font-medium">{post.author.name}</div>
              <div className="text-xs text-gray-600">{post.author.specialization}</div>
            </div>
          </div>

          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>{post.readTime} мин</span>
            </div>
          </div>
          
          <Button asChild size="sm" variant="outline">
            <Link to={`/experts/blog/${post.id}`}>
              Читать
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogPost;
