
import React from 'react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Users, Activity, Building, MessageSquare, Settings, UserCheck } from 'lucide-react';

const AdminTabsNavigation = () => {
  const tabs = [
    { value: "roles", icon: Shield, label: "Роли", gradient: "from-purple-500 to-pink-500" },
    { value: "verifications", icon: UserCheck, label: "Верификации", gradient: "from-blue-500 to-cyan-500" },
    { value: "activity", icon: Activity, label: "Активность", gradient: "from-green-500 to-emerald-500" },
    { value: "security", icon: Shield, label: "Безопасность", gradient: "from-red-500 to-orange-500" },
    { value: "organizations", icon: Building, label: "Организации", gradient: "from-indigo-500 to-purple-500" },
    { value: "support", icon: MessageSquare, label: "Поддержка", gradient: "from-yellow-500 to-orange-500" },
    { value: "settings", icon: Settings, label: "Настройки", gradient: "from-gray-500 to-slate-500" }
  ];

  return (
    <TabsList className="grid w-full grid-cols-7 bg-white/95 backdrop-blur-sm shadow-lg border border-slate-200/30 rounded-xl p-1">
      {tabs.map((tab) => (
        <TabsTrigger 
          key={tab.value}
          value={tab.value} 
          className={`flex items-center space-x-2 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:${tab.gradient} data-[state=active]:text-white`}
        >
          <tab.icon className="w-4 h-4" />
          <span className="hidden sm:inline">{tab.label}</span>
        </TabsTrigger>
      ))}
    </TabsList>
  );
};

export default AdminTabsNavigation;
