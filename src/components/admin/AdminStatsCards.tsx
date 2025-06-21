
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Users, Building, MessageSquare, AlertTriangle } from 'lucide-react';

const AdminStatsCards = () => {
  const statsData = [
    {
      title: "Всего пользователей",
      value: "12,847",
      change: "+8.2% за месяц",
      icon: Users,
      gradient: "from-blue-500 to-blue-600",
      textColors: "text-blue-100 text-blue-200"
    },
    {
      title: "Организации",
      value: "127",
      change: "Активных: 89",
      icon: Building,
      gradient: "from-green-500 to-green-600",
      textColors: "text-green-100 text-green-200"
    },
    {
      title: "Открытые тикеты",
      value: "45",
      change: "Среднее время: 2.1 ч",
      icon: MessageSquare,
      gradient: "from-purple-500 to-purple-600",
      textColors: "text-purple-100 text-purple-200"
    },
    {
      title: "Критические события",
      value: "3",
      change: "Требуют внимания",
      icon: AlertTriangle,
      gradient: "from-orange-500 to-red-600",
      textColors: "text-orange-100 text-orange-200"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statsData.map((stat, index) => (
        <Card key={index} className={`bg-gradient-to-br ${stat.gradient} text-white shadow-xl border-0 hover:shadow-2xl transition-all duration-300 group`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className={`${stat.textColors.split(' ')[0]} text-sm font-medium`}>{stat.title}</div>
                <div className="text-3xl font-bold">{stat.value}</div>
                <div className={`${stat.textColors.split(' ')[1]} text-xs`}>{stat.change}</div>
              </div>
              <div className="bg-white/20 rounded-full p-3 group-hover:scale-110 transition-transform duration-200">
                <stat.icon className="w-8 h-8 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AdminStatsCards;
