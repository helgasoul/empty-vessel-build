
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Lock, Clock, AlertTriangle, Save, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SecuritySetting {
  id: string;
  setting_name: string;
  setting_value: any;
  description: string;
  updated_at: string;
}

const AdminSecuritySettings = () => {
  const { toast } = useToast();
  const [hasChanges, setHasChanges] = useState(false);

  // Mock data - в реальном приложении это будет загружаться из базы данных
  const [passwordPolicy, setPasswordPolicy] = useState({
    min_length: 8,
    require_uppercase: true,
    require_lowercase: true,
    require_numbers: true,
    require_special_chars: true,
    max_age_days: 90
  });

  const [sessionSettings, setSessionSettings] = useState({
    timeout_minutes: 480,
    idle_timeout_minutes: 60,
    concurrent_sessions_limit: 3,
    force_logout_on_password_change: true
  });

  const [mfaPolicy, setMfaPolicy] = useState({
    required_for_admins: true,
    required_for_doctors: false,
    required_for_clinics: false,
    grace_period_days: 7,
    backup_codes_count: 10
  });

  const [auditSettings, setAuditSettings] = useState({
    log_retention_days: 365,
    log_failed_logins: true,
    log_data_access: true,
    log_admin_actions: true,
    alert_on_multiple_failures: true,
    failure_threshold: 5
  });

  const handleSaveSettings = () => {
    // Здесь будет логика сохранения настроек в базу данных
    toast({
      title: "Настройки сохранены",
      description: "Настройки безопасности успешно обновлены",
    });
    setHasChanges(false);
  };

  const handleResetToDefaults = () => {
    // Сброс к значениям по умолчанию
    setPasswordPolicy({
      min_length: 8,
      require_uppercase: true,
      require_lowercase: true,
      require_numbers: true,
      require_special_chars: true,
      max_age_days: 90
    });
    setHasChanges(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Настройки безопасности</h2>
          <p className="text-gray-600">Управление политиками безопасности платформы</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={handleResetToDefaults}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Сбросить</span>
          </Button>
          <Button 
            onClick={handleSaveSettings}
            disabled={!hasChanges}
            className="flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Сохранить</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="password" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="password" className="flex items-center space-x-2">
            <Lock className="w-4 h-4" />
            <span>Пароли</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center space-x-2">
            <Clock className="w-4 h-4" />
            <span>Сессии</span>
          </TabsTrigger>
          <TabsTrigger value="mfa" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>MFA</span>
          </TabsTrigger>
          <TabsTrigger value="audit" className="flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4" />
            <span>Аудит</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Политика паролей</CardTitle>
              <CardDescription>
                Настройки требований к паролям пользователей
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="min_length">Минимальная длина пароля</Label>
                  <Input
                    id="min_length"
                    type="number"
                    value={passwordPolicy.min_length}
                    onChange={(e) => {
                      setPasswordPolicy({...passwordPolicy, min_length: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                    min="6"
                    max="32"
                  />
                </div>
                
                <div>
                  <Label htmlFor="max_age">Срок действия пароля (дни)</Label>
                  <Input
                    id="max_age"
                    type="number"
                    value={passwordPolicy.max_age_days}
                    onChange={(e) => {
                      setPasswordPolicy({...passwordPolicy, max_age_days: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                    min="30"
                    max="365"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="uppercase">Требовать заглавные буквы</Label>
                  <Switch
                    id="uppercase"
                    checked={passwordPolicy.require_uppercase}
                    onCheckedChange={(checked) => {
                      setPasswordPolicy({...passwordPolicy, require_uppercase: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="lowercase">Требовать строчные буквы</Label>
                  <Switch
                    id="lowercase"
                    checked={passwordPolicy.require_lowercase}
                    onCheckedChange={(checked) => {
                      setPasswordPolicy({...passwordPolicy, require_lowercase: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="numbers">Требовать цифры</Label>
                  <Switch
                    id="numbers"
                    checked={passwordPolicy.require_numbers}
                    onCheckedChange={(checked) => {
                      setPasswordPolicy({...passwordPolicy, require_numbers: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="special">Требовать специальные символы</Label>
                  <Switch
                    id="special"
                    checked={passwordPolicy.require_special_chars}
                    onCheckedChange={(checked) => {
                      setPasswordPolicy({...passwordPolicy, require_special_chars: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Управление сессиями</CardTitle>
              <CardDescription>
                Настройки времени жизни и безопасности пользовательских сессий
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="session_timeout">Тайм-аут сессии (минуты)</Label>
                  <Input
                    id="session_timeout"
                    type="number"
                    value={sessionSettings.timeout_minutes}
                    onChange={(e) => {
                      setSessionSettings({...sessionSettings, timeout_minutes: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                    min="15"
                    max="1440"
                  />
                </div>
                
                <div>
                  <Label htmlFor="idle_timeout">Тайм-аут неактивности (минуты)</Label>
                  <Input
                    id="idle_timeout"
                    type="number"
                    value={sessionSettings.idle_timeout_minutes}
                    onChange={(e) => {
                      setSessionSettings({...sessionSettings, idle_timeout_minutes: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                    min="5"
                    max="120"
                  />
                </div>
                
                <div>
                  <Label htmlFor="concurrent_limit">Лимит одновременных сессий</Label>
                  <Input
                    id="concurrent_limit"
                    type="number"
                    value={sessionSettings.concurrent_sessions_limit}
                    onChange={(e) => {
                      setSessionSettings({...sessionSettings, concurrent_sessions_limit: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                    min="1"
                    max="10"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="force_logout">Принудительный выход при смене пароля</Label>
                <Switch
                  id="force_logout"
                  checked={sessionSettings.force_logout_on_password_change}
                  onCheckedChange={(checked) => {
                    setSessionSettings({...sessionSettings, force_logout_on_password_change: checked});
                    setHasChanges(true);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="mfa">
          <Card>
            <CardHeader>
              <CardTitle>Многофакторная аутентификация (MFA)</CardTitle>
              <CardDescription>
                Настройки требований к двухфакторной аутентификации
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="mfa_admins">Обязательно для администраторов</Label>
                  <Switch
                    id="mfa_admins"
                    checked={mfaPolicy.required_for_admins}
                    onCheckedChange={(checked) => {
                      setMfaPolicy({...mfaPolicy, required_for_admins: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="mfa_doctors">Обязательно для врачей</Label>
                  <Switch
                    id="mfa_doctors"
                    checked={mfaPolicy.required_for_doctors}
                    onCheckedChange={(checked) => {
                      setMfaPolicy({...mfaPolicy, required_for_doctors: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="mfa_clinics">Обязательно для клиник</Label>
                  <Switch
                    id="mfa_clinics"
                    checked={mfaPolicy.required_for_clinics}
                    onCheckedChange={(checked) => {
                      setMfaPolicy({...mfaPolicy, required_for_clinics: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="grace_period">Льготный период (дни)</Label>
                  <Input
                    id="grace_period"
                    type="number"
                    value={mfaPolicy.grace_period_days}
                    onChange={(e) => {
                      setMfaPolicy({...mfaPolicy, grace_period_days: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                    min="0"
                    max="30"
                  />
                </div>
                
                <div>
                  <Label htmlFor="backup_codes">Количество резервных кодов</Label>
                  <Input
                    id="backup_codes"
                    type="number"
                    value={mfaPolicy.backup_codes_count}
                    onChange={(e) => {
                      setMfaPolicy({...mfaPolicy, backup_codes_count: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                    min="5"
                    max="20"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit">
          <Card>
            <CardHeader>
              <CardTitle>Настройки аудита</CardTitle>
              <CardDescription>
                Параметры логирования и мониторинга активности
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="retention">Срок хранения логов (дни)</Label>
                  <Input
                    id="retention"
                    type="number"
                    value={auditSettings.log_retention_days}
                    onChange={(e) => {
                      setAuditSettings({...auditSettings, log_retention_days: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                    min="30"
                    max="2555"
                  />
                </div>
                
                <div>
                  <Label htmlFor="failure_threshold">Порог неудачных попыток</Label>
                  <Input
                    id="failure_threshold"
                    type="number"
                    value={auditSettings.failure_threshold}
                    onChange={(e) => {
                      setAuditSettings({...auditSettings, failure_threshold: parseInt(e.target.value)});
                      setHasChanges(true);
                    }}
                    min="3"
                    max="20"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="log_failed">Логировать неудачные входы</Label>
                  <Switch
                    id="log_failed"
                    checked={auditSettings.log_failed_logins}
                    onCheckedChange={(checked) => {
                      setAuditSettings({...auditSettings, log_failed_logins: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="log_data">Логировать доступ к данным</Label>
                  <Switch
                    id="log_data"
                    checked={auditSettings.log_data_access}
                    onCheckedChange={(checked) => {
                      setAuditSettings({...auditSettings, log_data_access: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="log_admin">Логировать действия администраторов</Label>
                  <Switch
                    id="log_admin"
                    checked={auditSettings.log_admin_actions}
                    onCheckedChange={(checked) => {
                      setAuditSettings({...auditSettings, log_admin_actions: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="alert_failures">Уведомления о множественных неудачах</Label>
                  <Switch
                    id="alert_failures"
                    checked={auditSettings.alert_on_multiple_failures}
                    onCheckedChange={(checked) => {
                      setAuditSettings({...auditSettings, alert_on_multiple_failures: checked});
                      setHasChanges(true);
                    }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSecuritySettings;
