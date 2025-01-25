import { useEffect } from 'react';
import { Login } from '../../components/auth/Login';
import AuthLayout from '../../layouts/AuthLayout';

interface LoginPageProps {
  onFormFocus: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onFormFocus }) => {
  useEffect(() => {
    onFormFocus(); // 페이지 로드 시 오버레이 활성화
  }, [onFormFocus]);

  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
};

export default LoginPage;