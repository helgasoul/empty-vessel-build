
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, BookOpen, Star, Award } from "lucide-react";
import { Link } from "react-router-dom";

export interface Expert {
  id: string;
  name: string;
  specialization: string;
  title: string;
  experience: number;
  avatar: string;
  rating: number;
  description: string;
  education: string[];
  certifications: string[];
  blogPostsCount: number;
  consultation: {
    available: boolean;
    price: number;
  };
}

interface ExpertCardProps {
  expert: Expert;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expert }) => {
  const initials = expert.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={expert.avatar} alt={expert.name} />
            <AvatarFallback className="text-lg font-semibold bg-gradient-to-r from-purple-100 to-blue-100">
              {initials}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-xl">{expert.name}</CardTitle>
        <CardDescription className="text-sm font-medium text-primary">
          {expert.title}
        </CardDescription>
        <Badge variant="secondary" className="mx-auto w-fit">
          {expert.specialization}
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{expert.experience} лет опыта</span>
          </div>
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>{expert.rating}</span>
          </div>
        </div>

        <p className="text-sm text-gray-600 line-clamp-3">
          {expert.description}
        </p>

        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-sm">
            <Award className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Образование:</span>
          </div>
          <ul className="text-xs space-y-1 ml-6">
            {expert.education.slice(0, 2).map((edu, index) => (
              <li key={index} className="text-gray-600">• {edu}</li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-1">
            <BookOpen className="w-4 h-4 text-green-600" />
            <span>{expert.blogPostsCount} статей</span>
          </div>
          {expert.consultation.available && (
            <div className="text-right">
              <div className="text-xs text-gray-500">Консультация</div>
              <div className="font-semibold text-primary">{expert.consultation.price} ₽</div>
            </div>
          )}
        </div>

        <div className="flex space-x-2 pt-4">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link to={`/experts/${expert.id}/blog`}>
              <BookOpen className="w-4 h-4 mr-1" />
              Блог
            </Link>
          </Button>
          {expert.consultation.available && (
            <Button size="sm" className="flex-1">
              Консультация
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpertCard;
