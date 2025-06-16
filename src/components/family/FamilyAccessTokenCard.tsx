
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, Clock, User, Mail, FileText, Users, Activity, Users2 } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

interface FamilyAccessToken {
  id: string;
  family_group_id: string;
  invited_email: string;
  invited_name: string | null;
  token_code: string;
  expires_at: string;
  is_used: boolean;
  used_at: string | null;
  access_permissions: {
    medical_history: boolean;
    documents: boolean;
    personal_info: boolean;
  };
  invitation_message: string | null;
  created_at: string;
  family_groups?: {
    family_name: string;
  };
}

interface FamilyAccessTokenCardProps {
  token: FamilyAccessToken;
  onDelete: (tokenId: string) => void;
}

const FamilyAccessTokenCard: React.FC<FamilyAccessTokenCardProps> = ({ token, onDelete }) => {
  const getTokenStatus = (token: FamilyAccessToken) => {
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

  const getPermissionIcons = (permissions: FamilyAccessToken['access_permissions']) => {
    const icons = [];
    if (permissions.medical_history) icons.push({ icon: Activity, label: 'Медицинская история' });
    if (permissions.documents) icons.push({ icon: FileText, label: 'Документы' });
    if (permissions.personal_info) icons.push({ icon: User, label: 'Личная информация' });
    return icons;
  };

  const status = getTokenStatus(token);
  const permissionIcons = getPermissionIcons(token.access_permissions);

  return (
    <Card>
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

            {token.family_groups && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users2 className="w-4 h-4" />
                <span>{token.family_groups.family_name}</span>
              </div>
            )}

            <div className="space-y-1">
              {token.invited_name && (
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>{token.invited_name}</span>
                </div>
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                <span>{token.invited_email}</span>
              </div>
            </div>

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

            {token.invitation_message && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-700">{token.invitation_message}</p>
              </div>
            )}

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
                    и приглашенный член семьи больше не сможет получить доступ к данным по этому коду.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={() => onDelete(token.id)}
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
};

export default FamilyAccessTokenCard;
