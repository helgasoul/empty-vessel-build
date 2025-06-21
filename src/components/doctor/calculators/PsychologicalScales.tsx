
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Brain } from "lucide-react";

const PsychologicalScales = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Brain className="w-5 h-5 text-indigo-600" />
            <span>Психометрические шкалы</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">
            Здесь будут размещены психологические шкалы и опросники:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-gray-600">
            <li>• Шкала депрессии Бека</li>
            <li>• Госпитальная шкала тревоги и депрессии</li>
            <li>• Опросник качества жизни</li>
            <li>• Шкала стресса</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default PsychologicalScales;
