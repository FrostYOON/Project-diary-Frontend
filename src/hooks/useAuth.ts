import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../api/auth.api';
import { LoginCredentials } from '../types/auth.types';

export const useAuth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await login(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      alert('로그인 되었습니다.');
      navigate('/');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '이메일 또는 비밀번호가 일치하지 않습니다.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // TODO: Google OAuth 구현
      alert('구글 로그인 기능 준비 중입니다.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '구글 로그인에 실패했습니다.';
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    handleLogin,
    handleGoogleLogin,
  };
}; 