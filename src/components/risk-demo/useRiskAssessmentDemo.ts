
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { AssessmentType } from './types';

export const useRiskAssessmentDemo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartTest = (assessment: AssessmentType) => {
    console.log('handleStartTest called for:', assessment.title);
    
    // Проверяем авторизацию пользователя
    if (!user) {
      toast.info('Для прохождения тестов необходимо авторизоваться');
      console.log('User not authenticated, redirecting to auth');
      
      // Простое перенаправление без fallback
      navigate('/auth');
      return;
    }

    // Если пользователь авторизован, переходим к тестированию
    toast.success(`Начинаем тест: ${assessment.displayName}`);
    console.log('User authenticated, navigating to risk assessment');
    
    // Переходим на страницу оценки рисков с указанной вкладкой
    navigate('/risk-assessment');
  };

  const handleFullAssessment = () => {
    console.log('handleFullAssessment called');
    
    if (!user) {
      console.log('User not authenticated, redirecting to auth');
      navigate('/auth');
    } else {
      console.log('User authenticated, navigating to risk assessment');
      navigate('/risk-assessment');
    }
  };

  return {
    user,
    handleStartTest,
    handleFullAssessment
  };
};
