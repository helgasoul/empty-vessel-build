
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Copy, Eye, EyeOff, Clock, Shield, Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { format, addDays, addHours } from "date-fns";
import { ru } from "date-fns/locale";

interface DoctorDataSharingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTokenCreated: () => void;
}

const DoctorDataSharingModal: React.FC<DoctorDataSharingModalProps> = ({
  isOpen,
  onClose,
  onTokenCreated
}) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'generated'>('form');
  const [generatedToken, setGeneratedToken] = useState<string | null>(null);
  const [showToken, setShowToken] = useState(false);
  const [copied, setCopied] = useState(false);

  const [formData, setFormData] = useState({
    doctorName: '',
    doctorEmail: '',
    expirationPeriod: '24h',
    permissions: {
      medical_records: true,
      family_history: false,
      health_data: false
    }
  });

  const generateSecureToken = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const getExpirationDate = (period: string) => {
    const now = new Date();
    switch (period) {
      case '1h': return addHours(now, 1);
      case '6h': return addHours(now, 6);
      case '24h': return addDays(now, 1);
      case '3d': return addDays(now, 3);
      case '7d': return addDays(now, 7);
      default: return addDays(now, 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);

    try {
      const token = generateSecureToken();
      const expiresAt = getExpirationDate(formData.expirationPeriod);

      const { error } = await supabase
        .from('doctor_access_tokens')
        .insert({
          user_id: user.id,
          token_code: token,
          doctor_email: formData.doctorEmail || null,
          doctor_name: formData.doctorName || null,
          expires_at: expiresAt.toISOString(),
          access_permissions: formData.permissions
        });

      if (error) throw error;

      setGeneratedToken(token);
      setStep('generated');
      onTokenCreated();

      toast({
        title: "Токен доступа создан",
        description: "Одноразовый пароль для врача успешно создан"
      });

    } catch (error) {
      console.error('Error creating access token:', error);
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
      doctorName: '',
      doctorEmail: '',
      expirationPeriod: '24h',
      permissions: {
        medical_records: true,
        family_history: false,
        health_data: false
      }
    });
    onClose();
  };

  const expirationOptions = [
    { value: '1h', label: '1 час' },
    { value: '6h', label: '6 часов' },
    { value: '24h', label: '24 часа' },
    { value: '3d', label: '3 дня' },
    { value: '7d', label: '7 дней' }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Shield className="w-5 h-5 text-blue-600" />
            <span>Поделиться данными с врачом</span>
          </DialogTitle>
          <DialogDescription>
            Создайте одноразовый пароль для безопасного доступа врача к вашим медицинским данным
          </DialogDescription>
        </DialogHeader>

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doctorName">Имя врача (необязательно)</Label>
              <Input
                id="doctorName"
                value={formData.doctorName}
                onChange={(e) => setFormData(prev => ({ ...prev, doctorName: e.target.value }))}
                placeholder="Например: Др. Иванов"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="doctorEmail">Email врача (необязательно)</Label>
              <Input
                id="doctorEmail"
                type="email"
                value={formData.doctorEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, doctorEmail: e.target.value }))}
                placeholder="doctor@clinic.com"
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
                    id="medical_records"
                    checked={formData.permissions.medical_records}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, medical_records: !!checked }
                      }))
                    }
                  />
                  <Label htmlFor="medical_records" className="text-sm">
                    Медицинские записи и документы
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="family_history"
                    checked={formData.permissions.family_history}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, family_history: !!checked }
                      }))
                    }
                  />
                  <Label htmlFor="family_history" className="text-sm">
                    Семейная медицинская история
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="health_data"
                    checked={formData.permissions.health_data}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({
                        ...prev,
                        permissions: { ...prev.permissions, health_data: !!checked }
                      }))
                    }
                  />
                  <Label htmlFor="health_data" className="text-sm">
                    Данные с носимых устройств
                  </Label>
                </div>
              </div>
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
              <CardTitle className="text-center text-green-600">Токен создан!</CardTitle>
              <CardDescription className="text-center">
                Передайте этот код врачу для доступа к вашим данным
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
                {formData.doctorName && (
                  <div>Врач: {formData.doctorName}</div>
                )}
                {formData.doctorEmail && (
                  <div>Email: {formData.doctorEmail}</div>
                )}
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

export default DoctorDataSharingModal;
