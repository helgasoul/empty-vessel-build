
import { useSearchParams } from 'react-router-dom';

export const useAuthUrlParams = () => {
  const [searchParams] = useSearchParams();
  
  const type = searchParams.get('type');
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  const isPasswordReset = type === 'recovery' && accessToken && refreshToken;

  return {
    type,
    accessToken,
    refreshToken,
    isPasswordReset
  };
};
