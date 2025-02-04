import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { authService } from '../api/auth.api';
import { LoginCredentials } from '../types/auth.types';

export const useAuth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 구글 로그인 완료 후 처리
  useEffect(() => {
    const error = searchParams.get('error');
    
    if (error) {
      setError(decodeURIComponent(error));
      alert(decodeURIComponent(error));
      navigate('/login', { replace: true });
    }
  }, [searchParams, navigate]);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await authService.login(credentials);
      
      if (response.success && response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        navigate('/');
      } else {
        throw new Error('로그인에 실패했습니다.');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '이메일 또는 비밀번호가 일치하지 않습니다.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    window.location.href = `${API_URL}/auth/login/google`;
  };

  return {
    isLoading,
    error,
    handleLogin,
    handleGoogleLogin,
  };
}; 