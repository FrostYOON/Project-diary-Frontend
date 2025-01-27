import { useEffect } from 'react';
import { Login } from '../../components/auth/Login';
import AuthLayout from '../../layouts/AuthLayout';

interface LoginPageProps {
  onFormFocus: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onFormFocus }) => {
  useEffect(() => {
    onFormFocus();
  }, [onFormFocus]);

  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
};

export default LoginPage;