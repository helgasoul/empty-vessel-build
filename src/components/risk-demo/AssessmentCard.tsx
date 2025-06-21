
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Info, CheckCircle, Play } from "lucide-react";
import { AssessmentType } from "./types";

interface AssessmentCardProps {
  assessment: AssessmentType;
  onStartTest: (assessment: AssessmentType) => void;
}

const AssessmentCard: React.FC<AssessmentCardProps> = ({ assessment, onStartTest }) => {
  const IconComponent = assessment.icon;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-2 hover:border-purple-200 bg-white overflow-hidden">
      <CardHeader className={`bg-gradient-to-r ${assessment.bgColor} pb-6`}>
        <div className="flex items-start justify-between mb-4">
          <div className={`p-4 rounded-full bg-gradient-to-r ${assessment.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <IconComponent className="w-8 h-8 text-white" />
          </div>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="h-8 w-8 text-gray-500 hover:text-gray-600 hover:bg-white/50"
                aria-label={`Информация об алгоритме ${assessment.title}`}
              >
                <Info className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent className="max-w-sm p-4 bg-gray-800 text-white text-sm leading-relaxed">
              <p>{assessment.tooltip}</p>
            </TooltipContent>
          </Tooltip>
        </div>
        
        <div className="space-y-2">
          <CardTitle className="text-2xl font-bold text-gray-700 group-hover:text-purple-600 transition-colors">
            {assessment.displayName}
          </CardTitle>
          <Badge variant="outline" className="text-xs font-medium text-gray-500 bg-white/80">
            {assessment.title}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-4">
        <CardDescription className="text-gray-600 text-base leading-relaxed">
          {assessment.description}
        </CardDescription>
        
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            {assessment.validation}
          </Badge>
          <Badge className="bg-blue-100 text-blue-700 border-blue-200">
            {assessment.accuracy}
          </Badge>
        </div>
        
        <Button 
          className={`w-full bg-gradient-to-r ${assessment.color} hover:opacity-90 text-white font-semibold py-3 mt-4 group-hover:shadow-lg transition-all duration-300`}
          onClick={() => onStartTest(assessment)}
          aria-label={`Начать тест ${assessment.displayName}`}
        >
          <Play className="w-4 h-4 mr-2" />
          Начать тест
        </Button>
      </CardContent>
    </Card>
  );
};

export default AssessmentCard;
