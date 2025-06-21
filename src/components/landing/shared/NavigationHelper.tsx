
import { useNavigate } from 'react-router-dom';

export const useNavigationHelper = () => {
  const navigate = useNavigate();

  const handleButtonClick = (stepName: string, targetPath: string) => {
    return () => {
      console.log(`🔥 Шаг "${stepName}" - кнопка нажата`);
      console.log(`📍 Переход на: ${targetPath}`);
      
      try {
        navigate(targetPath);
        console.log(`✅ Навигация успешна к ${targetPath}`);
      } catch (error) {
        console.error(`❌ Ошибка навигации:`, error);
        window.location.href = targetPath;
      }
    };
  };

  return { handleButtonClick };
};
