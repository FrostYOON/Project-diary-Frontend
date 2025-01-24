import { useEffect } from 'react';
import SignUp from '../../components/auth/SignUp';
import AuthLayout from '../../layouts/AuthLayout';

interface SignUpPageProps {
  onFormFocus: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onFormFocus }) => {
  useEffect(() => {
    onFormFocus(); // 페이지 로드 시 오버레이 활성화
  }, [onFormFocus]);

  return (
    <AuthLayout>
      <SignUp />
    </AuthLayout>
  );
};

export default SignUpPage; 