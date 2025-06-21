
import React, { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import AuthHeader from '@/components/auth/AuthHeader';
import AuthForm from '@/components/auth/AuthForm';
import AuthModeToggle from '@/components/auth/AuthModeToggle';
import AuthInfoSection from '@/components/auth/AuthInfoSection';
import DebugInfoSection from '@/components/auth/DebugInfoSection';
import PasswordResetHandler from '@/components/auth/PasswordResetHandler';
import AuthStateManager from '@/components/auth/AuthStateManager';
import { useAuthUrlParams } from '@/hooks/useAuthUrlParams';
import { useAuthHandlers } from '@/hooks/useAuthHandlers';

const Auth = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { isPasswordReset } = useAuthUrlParams();
  const {
    isLoading,
    error,
    setError,
    handleSignIn,
    handleSignUp,
    handlePasswordUpdate
  } = useAuthHandlers();

  // Если пользователь уже авторизован, перенаправляем на главную
  useEffect(() => {
    if (user && !isPasswordReset) {
      navigate('/');
    }
  }, [user, navigate, isPasswordReset]);

  return (
    <div className="min-h-screen prevent-gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-2xl animate-fade-in">
        <AuthHeader />

        <Card className="prevent-card">
          <CardHeader className="text-center">
            <AuthStateManager>
              {({ isLogin, selectedRole, adminCode, formData, setSelectedRole, setAdminCode, setFormData, handleModeToggle }) => (
                <>
                  <CardTitle className="text-2xl font-montserrat">
                    {isLogin ? 'Добро пожаловать в PREVENT' : 'Регистрация в PREVENT'}
                  </CardTitle>
                  <CardDescription className="font-roboto">
                    Ваша персональная платформа превентивной медицины
                  </CardDescription>

                  <CardContent className="space-y-6">
                    <PasswordResetHandler
                      user={user}
                      onPasswordUpdate={handlePasswordUpdate}
                      isLoading={isLoading}
                    />

                    {!isPasswordReset && (
                      <>
                        <AuthForm
                          isLogin={isLogin}
                          formData={formData}
                          setFormData={setFormData}
                          selectedRole={selectedRole}
                          onRoleChange={(role) => {
                            console.log('🔄 Роль изменена на:', role);
                            setSelectedRole(role);
                            setError('');
                          }}
                          adminCode={adminCode}
                          onAdminCodeChange={setAdminCode}
                          error={error}
                          isLoading={isLoading}
                          onSubmit={isLogin 
                            ? (e) => handleSignIn(e, formData) 
                            : (e) => handleSignUp(e, formData, selectedRole, adminCode)
                          }
                        />

                        <AuthModeToggle
                          isLogin={isLogin}
                          onToggle={handleModeToggle}
                        />

                        <DebugInfoSection
                          isLogin={isLogin}
                          selectedRole={selectedRole}
                          adminCode={adminCode}
                        />

                        <AuthInfoSection selectedRole={selectedRole} />
                      </>
                    )}
                  </CardContent>
                </>
              )}
            </AuthStateManager>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
};

export default Auth;
