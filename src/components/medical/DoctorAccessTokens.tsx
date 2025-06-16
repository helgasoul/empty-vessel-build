
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Shield, Plus, Trash2, Eye, Clock, User, Mail, FileText, Users, Activity } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import DoctorDataSharingModal from "./DoctorDataSharingModal";

interface AccessToken {
  id: string;
  token_code: string;
  doctor_name: string | null;
  doctor_email: string | null;
  expires_at: string;
  is_used: boolean;
  used_at: string | null;
  access_permissions: {
    medical_records: boolean;
    family_history: boolean;
    health_data: boolean;
  };
  created_at: string;
}

const DoctorAccessTokens: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [tokens, setTokens] = useState<AccessToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (user) {
      loadTokens();
    }
  }, [user]);

  const loadTokens = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('doctor_access_tokens')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Type assertion to handle Json type from Supabase
      const typedTokens = (data || []).map(token => ({
        ...token,
        access_permissions: token.access_permissions as {
          medical_records: boolean;
          family_history: boolean;
          health_data: boolean;
        }
      }));
      
      setTokens(typedTokens);
    } catch (error) {
      console.error('Error loading access tokens:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить токены доступа",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteToken = async (tokenId: string) => {
    try {
      const { error } = await supabase
        .from('doctor_access_tokens')
        .delete()
        .eq('id', tokenId);

      if (error) throw error;

      setTokens(prev => prev.filter(token => token.id !== tokenId));
      toast({
        title: "Токен удален",
        description: "Токен доступа успешно удален"
      });
    } catch (error) {
      console.error('Error deleting token:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось удалить токен",
        variant: "destructive"
      });
    }
  };

  const getTokenStatus = (token: AccessToken) => {
    if (token.is_used) {
      return { status: 'used', label: 'Использован', variant: 'secondary' as const };
    }
    
    const now = new Date();
    const expiresAt = new Date(token.expires_at);
    
    if (expiresAt < now) {
      return { status: 'expired', label: 'Истек', variant: 'destructive' as const };
    }
    
    return { status: 'active', label: 'Активен', variant: 'default' as const };
  };

  const getPermissionIcons = (permissions: AccessToken['access_permissions']) => {
    const icons = [];
    if (permissions.medical_records) icons.push({ icon: FileText, label: 'Медицинские записи' });
    if (permissions.family_history) icons.push({ icon: Users, label: 'Семейная история' });
    if (permissions.health_data) icons.push({ icon: Activity, label: 'Данные устройств' });
    return icons;
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-blue-600" />
                <span>Доступ для врачей</span>
              </CardTitle>
              <CardDescription>
                Управляйте токенами доступа для врачей к вашим медицинским данным
              </CardDescription>
            </div>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Создать токен
            </Button>
          </div>
        </CardHeader>
      </Card>

      {tokens.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Нет активных токенов
            </h3>
            <p className="text-gray-600 mb-4">
              Создайте токен доступа для безопасного обмена данными с врачом
            </p>
            <Button onClick={() => setShowCreateModal(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Создать первый токен
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {tokens.map((token) => {
            const status = getTokenStatus(token);
            const permissionIcons = getPermissionIcons(token.access_permissions);

            return (
              <Card key={token.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center space-x-3">
                        <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                          {token.token_code}
                        </code>
                        <Badge variant={status.variant}>
                          {status.label}
                        </Badge>
                      </div>

                      {(token.doctor_name || token.doctor_email) && (
                        <div className="space-y-1">
                          {token.doctor_name && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <User className="w-4 h-4" />
                              <span>{token.doctor_name}</span>
                            </div>
                          )}
                          {token.doctor_email && (
                            <div className="flex items-center space-x-2 text-sm text-gray-600">
                              <Mail className="w-4 h-4" />
                              <span>{token.doctor_email}</span>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {token.is_used 
                              ? `Использован ${format(new Date(token.used_at!), 'dd MMM yyyy, HH:mm', { locale: ru })}`
                              : `Истекает ${format(new Date(token.expires_at), 'dd MMM yyyy, HH:mm', { locale: ru })}`
                            }
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Разрешения:</span>
                        <div className="flex space-x-2">
                          {permissionIcons.map(({ icon: Icon, label }, index) => (
                            <div key={index} className="flex items-center space-x-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded">
                              <Icon className="w-3 h-3" />
                              <span>{label}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Создан {format(new Date(token.created_at), 'dd MMM yyyy, HH:mm', { locale: ru })}
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Удалить токен доступа?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Это действие нельзя отменить. Токен будет безвозвратно удален,
                              и врач больше не сможет получить доступ к вашим данным по этому коду.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Отмена</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteToken(token.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Удалить
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <DoctorDataSharingModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTokenCreated={loadTokens}
      />
    </div>
  );
};

export default DoctorAccessTokens;
