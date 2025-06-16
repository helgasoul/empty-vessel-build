
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Eye, EyeOff, Clock, Shield, Check, Users2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, addHours } from "date-fns";
import { ru } from "date-fns/locale";

interface CreateFamilyAccessTokenModalProps {
  isOpen: boolean;
  onClose: () => void;
  familyGroupId: string;
  familyGroupName: string;
  onTokenCreated: () => void;
  createToken: (tokenData: any) => Promise<any>;
}

const CreateFamilyAccessTokenModal: React.FC<CreateFamilyAccessTokenModalProps> = ({
  isOpen,
  onClose,
  familyGroupId,
  familyGroupName,
  onTokenCreated,
  createToken
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'generated'>('form');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    invitedName: '',
    invitedEmail: '',
    expirationPeriod: '7d',
    permissions: {
      medical_history: true,
      documents: false,
      personal_info: false
    },
    invitationMessage: ''
  });

  const getExpirationDate = (period: string) => {
    const now = new Date();
    switch (period) {
      case '1h': return addHours(now, 1);
      case '6h': return addHours(now, 6);
      case '24h': return addDays(now, 1);
      case '3d': return addDays(now, 3);
      case '7d': return addDays(now, 7);
      case '30d': return addDays(now, 30);
      default: return addDays(now, 7);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!formData.invitedEmail) {
      toast({
        title: "Ошибка",
        description: "Укажите email приглашаемого члена семьи",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      const expiresAt = getExpirationDate(formData.expirationPeriod);

      const result = await createToken({
        familyGroupId,
        invitedEmail: formData.invitedEmail,
        invitedName: formData.invitedName,
        expiresAt,
        permissions: formData.permissions,
        invitationMessage: formData.invitationMessage
      });

      setGeneratedToken(result.token_code);
      setStep('generated');
      onTokenCreated();

      toast({
        title: "Токен доступа создан",
        description: "Одноразовый пароль для члена семьи успешно создан"
      });

    } catch (error) {
      console.error('Error creating family access token:', error);
      toast({
        title: "Ошибка",
        description: "Не удалось создать токен доступа",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (generatedToken) {
      await navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Скопировано!",
        description: "Токен доступа скопирован в буфер обмена"
      });
    }
  };

  const handleClose = () => {
    setStep('form');
    setGeneratedToken(null);
    setShowToken(false);
    setCopied(false);
    setFormData({
      invitedName: '',
      invitedEmail: '',
      expirationPeriod: '7d',
      permissions: {
        medical_history: true,
        documents: false,
        personal_info: false
      },
      invitationMessage: ''
    });
    onClose();
  };

  const expirationOptions = [
    { value: '1h', label: '1 час' },
    { value: '6h', label: '6 часов' },
    { value: '24h', label: '24 часа' },
    { value: '3d', label: '3 дня' },
    { value: '7d', label: '7 дней' },
    { value: '30d', label: '30 дней' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Users2 className="w-5 h-5 text-blue-600" />
            <span>Пригласить члена семьи</span>
          </DialogTitle>
          <DialogDescription>
            Создайте токен доступа для приглашения члена семьи к "{familyGroupName}"
          </DialogDescription>
        </DialogHeader>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invitedName">Имя приглашаемого</Label>
              <Input
                id="invitedName"
                value={formData.invitedName}
                onChange={(e) => setFormData(prev => ({ ...prev, invitedName: e.target.value }))}
                placeholder="Например: Мария Иванова"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invitedEmail">Email приглашаемого *</Label>
              <Input
                id="invitedEmail"
                type="email"
                required
                value={formData.invitedEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, invitedEmail: e.target.value }))}
                placeholder="maria@example.com"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="expiration">Срок действия токена</Label>
              <Select
                value={formData.expirationPeriod}
                onValueChange={(value) => setFormData(prev => ({ ...prev, expirationPeriod: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {expirationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <Label>Разрешения доступа</Label>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="medical_history"
                    checked={formData.permissions.medical_history}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, medical_history: !!checked }
                      }))
                    }
                  />
                  <Label htmlFor="medical_history" className="text-sm">
                    Медицинская история семьи
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="documents"
                    checked={formData.permissions.documents}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, documents: !!checked }
                      }))
                    }
                  />
                  <Label htmlFor="documents" className="text-sm">
                    Семейные документы
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="personal_info"
                    checked={formData.permissions.personal_info}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, personal_info: !!checked }
                      }))
                    }
                  />
                  <Label htmlFor="personal_info" className="text-sm">
                    Личная информация членов семьи
                  </Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="invitation">Сообщение-приглашение</Label>
              <Textarea
                id="invitation"
                value={formData.invitationMessage}
                onChange={(e) => setFormData(prev => ({ ...prev, invitationMessage: e.target.value }))}
                placeholder="Добавьте персональное сообщение к приглашению..."
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={handleClose}>
                Отмена
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Создание...' : 'Создать токен'}
              </Button>
            </div>
          </form>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-600">Приглашение создано!</CardTitle>
              <CardDescription className="text-center">
                Отправьте этот код приглашаемому члену семьи
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-sm font-medium">Код доступа:</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowToken(!showToken)}
                  >
                    {showToken ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="text-lg font-mono bg-white p-2 rounded border flex-1 text-center">
                    {showToken ? generatedToken : '••••••••'}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyToClipboard}
                    className="shrink-0"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    Действителен до: {format(getExpirationDate(formData.expirationPeriod), 'dd MMM yyyy, HH:mm', { locale: ru })}
                  </span>
                </div>
                <div>Семейная группа: {familyGroupName}</div>
                {formData.invitedName && (
                  <div>Приглашаемый: {formData.invitedName}</div>
                )}
                <div>Email: {formData.invitedEmail}</div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <strong>Важно:</strong> Этот код можно использовать только один раз. 
                  После использования он станет недействительным.
                </p>
              </div>

              <Button onClick={handleClose} className="w-full">
                Закрыть
              </Button>
            </CardContent>
          </Card>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default CreateFamilyAccessTokenModal;
