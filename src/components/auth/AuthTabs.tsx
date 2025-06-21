
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserRole } from '@/types/user';
import RoleSelector from './RoleSelector';
import PasswordResetDialog from './PasswordResetDialog';

interface AuthTabsProps {
  onSignIn: (e: React.FormEvent<HTMLFormElement>) => void;
  onSignUp: (e: React.FormEvent<HTMLFormElement>) => void;
  onPasswordReset: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
  isResetLoading: boolean;
  resetDialogOpen: boolean;
  setResetDialogOpen: (open: boolean) => void;
  selectedRole: UserRole;
  setSelectedRole: (role: UserRole) => void;
  adminCode: string;
  setAdminCode: (code: string) => void;
}

const AuthTabs = ({
  onSignIn,
  onSignUp,
  onPasswordReset,
  isLoading,
  isResetLoading,
  resetDialogOpen,
  setResetDialogOpen,
  selectedRole,
  setSelectedRole,
  adminCode,
  setAdminCode
}: AuthTabsProps) => {
  return (
    <Tabs defaultValue="signin" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="signin" className="font-medium">Вход</TabsTrigger>
        <TabsTrigger value="signup" className="font-medium">Регистрация</TabsTrigger>
      </TabsList>

      <TabsContent value="signin" className="space-y-4">
        <form onSubmit={onSignIn} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="signin-email" className="font-roboto">Email</Label>
            <Input
              id="signin-email"
              name="email"
              type="email"
              placeholder="your@email.com"
              required
              className="font-roboto"
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="signin-password" className="font-roboto">Пароль</Label>
            <Input
              id="signin-password"
              name="password"
              type="password"
              required
              className="font-roboto"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            className="w-full prevent-button-primary"
            disabled={isLoading}
          >
            {isLoading ? "Вход..." : "Войти"}
          </Button>
        </form>
        
        <div className="text-center">
          <PasswordResetDialog
            open={resetDialogOpen}
            onOpenChange={setResetDialogOpen}
            onSubmit={onPasswordReset}
            isLoading={isResetLoading}
          />
        </div>
      </TabsContent>

      <TabsContent value="signup" className="space-y-6">
        <form onSubmit={onSignUp} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signup-name" className="font-roboto">Полное имя</Label>
              <Input
                id="signup-name"
                name="fullName"
                type="text"
                placeholder="Анна Иванова"
                required
                className="font-roboto"
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-email" className="font-roboto">Email</Label>
              <Input
                id="signup-email"
                name="email"
                type="email"
                placeholder="your@email.com"
                required
                className="font-roboto"
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="signup-password" className="font-roboto">Пароль</Label>
            <Input
              id="signup-password"
              name="password"
              type="password"
              minLength={6}
              required
              className="font-roboto"
              disabled={isLoading}
            />
          </div>

          <RoleSelector
            selectedRole={selectedRole}
            onRoleChange={setSelectedRole}
            adminCode={adminCode}
            onAdminCodeChange={setAdminCode}
            isLoading={isLoading}
          />

          <Button
            type="submit"
            className="w-full prevent-button-primary text-lg py-3"
            disabled={isLoading}
          >
            {isLoading ? "Регистрация..." : "Создать аккаунт"}
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
};

export default AuthTabs;
