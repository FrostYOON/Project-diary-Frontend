import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const AuthCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    
    if (accessToken) {
      // localStorage에 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      // 메인 페이지로 리다이렉트
      navigate('/', { replace: true });
    } else {
      // 토큰이 없으면 로그인 페이지로
      navigate('/login', { replace: true });
    }
  }, [navigate, searchParams]);

  // 빈 페이지 렌더링 (깜빡임 방지)
  return null;
};

export default AuthCallback; 