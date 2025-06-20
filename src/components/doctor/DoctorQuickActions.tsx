
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserPlus, Calculator, AlertTriangle, Activity, FileText, Calendar } from "lucide-react";

const DoctorQuickActions = () => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
            <UserPlus className="w-5 h-5 text-blue-600" />
            <span className="text-xs">Новый пациент</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
            <Calculator className="w-5 h-5 text-green-600" />
            <span className="text-xs">Калькуляторы</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
            <AlertTriangle className="w-5 h-5 text-orange-600" />
            <span className="text-xs">Высокий риск</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
            <Activity className="w-5 h-5 text-purple-600" />
            <span className="text-xs">Мониторинг</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
            <FileText className="w-5 h-5 text-indigo-600" />
            <span className="text-xs">Отчеты</span>
          </Button>
          
          <Button variant="outline" className="flex flex-col items-center space-y-2 h-20">
            <Calendar className="w-5 h-5 text-red-600" />
            <span className="text-xs">Расписание</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorQuickActions;
