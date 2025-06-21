
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Activity, ArrowRight } from "lucide-react";
import { LucideIcon } from 'lucide-react';

interface HealthAreaCardProps {
  title: string;
  description: string;
  expandedDescription: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  textColor: string;
  buttonAction: string;
  value: string;
  route: string;
  onAreaAction: () => void;
  onDetailsClick: () => void;
}

const HealthAreaCard = ({
  title,
  description,
  expandedDescription,
  icon: IconComponent,
  color,
  bgColor,
  borderColor,
  textColor,
  buttonAction,
  value,
  onAreaAction,
  onDetailsClick
}: HealthAreaCardProps) => {
  return (
    <Card 
      className={`group hover:shadow-xl transition-all duration-300 hover:scale-[1.03] ${borderColor} border-2 bg-white overflow-hidden hover:-translate-y-1`}
    >
      <CardHeader className={`bg-gradient-to-r ${bgColor} pb-6 relative`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-4 rounded-full bg-gradient-to-r ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <Badge className={`${textColor} bg-white/80 border-current`}>
            Доступно
          </Badge>
        </div>
        
        <div className="space-y-3">
          <CardTitle className={`text-2xl font-bold ${textColor} group-hover:text-opacity-80 transition-colors`}>
            {title}
          </CardTitle>
          <CardDescription className="text-gray-600 text-base leading-relaxed">
            {expandedDescription}
          </CardDescription>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg">
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">{value}</span>
        </div>
        
        <div className="flex flex-col gap-3">
          <Button 
            className={`w-full bg-gradient-to-r ${color} hover:opacity-90 text-white font-semibold py-3 group-hover:shadow-lg transition-all duration-300`}
            onClick={onAreaAction}
          >
            <Activity className="w-4 h-4 mr-2" />
            {buttonAction}
          </Button>
          
          <Button 
            variant="outline" 
            className={`w-full ${textColor} ${borderColor} hover:bg-opacity-10 transition-colors`}
            onClick={onDetailsClick}
          >
            Подробнее
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HealthAreaCard;
