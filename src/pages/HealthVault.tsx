
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import BackButton from '@/components/ui/back-button';
import FileUpload from '@/components/healthVault/FileUpload';
import FilesList from '@/components/healthVault/FilesList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  Activity, 
  Calendar,
  Database,
  Shield,
  Search
} from 'lucide-react';

const HealthVault = () => {
  const { user, loading } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Загрузка...</div>;
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleUploadComplete = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <BackButton fallbackPath="/dashboard" className="mb-4" />
        
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Медицинское хранилище данных
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl">
            Безопасно храните и управляйте всеми своими медицинскими документами в одном месте. 
            Загружайте анализы, снимки, консультации и другие медицинские данные.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-blue-100">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="font-medium">Безопасность</span>
            </div>
            <p className="text-sm text-gray-600">
              Все файлы зашифрованы и защищены
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-green-100">
            <div className="flex items-center gap-3 mb-2">
              <Database className="h-5 w-5 text-green-600" />
              <span className="font-medium">Организация</span>
            </div>
            <p className="text-sm text-gray-600">
              Автоматическая категоризация документов
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-purple-100">
            <div className="flex items-center gap-3 mb-2">
              <Search className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Поиск</span>
            </div>
            <p className="text-sm text-gray-600">
              Быстрый поиск по всем документам
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-lg shadow-sm border border-orange-100">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="h-5 w-5 text-orange-600" />
              <span className="font-medium">Анализ</span>
            </div>
            <p className="text-sm text-gray-600">
              ИИ-анализ медицинских данных
            </p>
          </div>
        </div>

        <Tabs defaultValue="upload" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Загрузить
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Документы
            </TabsTrigger>
            <TabsTrigger value="events" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              События
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Аналитика
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <FileUpload onUploadComplete={handleUploadComplete} />
          </TabsContent>

          <TabsContent value="documents" className="space-y-6">
            <FilesList refreshTrigger={refreshTrigger} />
          </TabsContent>

          <TabsContent value="events" className="space-y-6">
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="text-center">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Медицинские события
                </h3>
                <p className="text-gray-600">
                  Функция медицинских событий находится в разработке. 
                  Здесь вы сможете отслеживать важные медицинские даты и события.
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <div className="text-center">
                <Activity className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Аналитика здоровья
                </h3>
                <p className="text-gray-600">
                  ИИ-анализ ваших медицинских данных находится в разработке. 
                  Вскоре вы сможете получать персонализированные insights о своем здоровье.
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default HealthVault;
