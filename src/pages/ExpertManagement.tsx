
import React, { useState } from 'react';
import { Breadcrumbs } from "@/components/ui/breadcrumb";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, Users, Star } from "lucide-react";
import { useExperts, useDeleteExpert, Expert } from '@/hooks/useExperts';
import { useToast } from "@/hooks/use-toast";
import ExpertForm from '@/components/experts/ExpertForm';

const ExpertManagement = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingExpert, setEditingExpert] = useState<Expert | undefined>();
  const { data: experts, isLoading } = useExperts();
  const deleteExpert = useDeleteExpert();
  const { toast } = useToast();

  const handleEdit = (expert: Expert) => {
    setEditingExpert(expert);
    setShowForm(true);
  };

  const handleDelete = async (expert: Expert) => {
    if (window.confirm(`Вы уверены, что хотите удалить эксперта ${expert.name}?`)) {
      try {
        await deleteExpert.mutateAsync(expert.id);
        toast({
          title: "Эксперт удален",
          description: `${expert.name} успешно удален`,
        });
      } catch (error) {
        toast({
          title: "Ошибка",
          description: "Не удалось удалить эксперта",
          variant: "destructive",
        });
      }
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingExpert(undefined);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingExpert(undefined);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-lg">Загрузка...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            { href: "/", label: "Главная" },
            { href: "/experts", label: "Эксперты" },
            { label: "Управление экспертами" }
          ]}
          className="mb-6"
        />

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Управление экспертами</h1>
            <p className="text-gray-600 mt-2">Добавляйте и редактируйте информацию об экспертах</p>
          </div>
          
          <Dialog open={showForm} onOpenChange={setShowForm}>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingExpert(undefined)}>
                <Plus className="w-4 h-4 mr-2" />
                Добавить эксперта
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <ExpertForm
                expert={editingExpert}
                onSuccess={handleFormSuccess}
                onCancel={handleFormCancel}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Users className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Всего экспертов</p>
                  <p className="text-2xl font-bold text-gray-900">{experts?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Star className="w-8 h-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Средний рейтинг</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {experts?.length ? (experts.reduce((acc, expert) => acc + (expert.rating || 0), 0) / experts.length).toFixed(1) : '0.0'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-600 rounded-full"></div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Доступны для консультаций</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {experts?.filter(expert => expert.consultation_available).length || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Experts List */}
        <Card>
          <CardHeader>
            <CardTitle>Список экспертов</CardTitle>
            <CardDescription>
              Управляйте профилями экспертов платформы
            </CardDescription>
          </CardHeader>
          <CardContent>
            {experts?.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Нет экспертов
                </h3>
                <p className="text-gray-600 mb-4">
                  Добавьте первого эксперта, чтобы начать работу
                </p>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить эксперта
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {experts?.map((expert) => (
                  <div key={expert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={expert.avatar_url} alt={expert.name} />
                        <AvatarFallback className="bg-gradient-to-r from-purple-100 to-blue-100">
                          {expert.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{expert.name}</h3>
                        <p className="text-gray-600">{expert.title}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="secondary">{expert.specialization}</Badge>
                          <span className="text-sm text-gray-500">{expert.experience} лет опыта</span>
                          {expert.rating && (
                            <div className="flex items-center space-x-1">
                              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm">{expert.rating}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {expert.consultation_available && expert.consultation_price && (
                        <div className="text-right mr-4">
                          <div className="text-sm text-gray-500">Консультация</div>
                          <div className="font-semibold">{expert.consultation_price} ₽</div>
                        </div>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(expert)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(expert)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ExpertManagement;
