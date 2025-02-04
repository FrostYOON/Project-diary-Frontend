import { useEffect } from 'react';
import SignUp from '../../components/auth/SignUp';
import AuthLayout from '../../layouts/AuthLayout';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

interface SignUpPageProps {
  onFormFocus: () => void;
}

const SignUpPage: React.FC<SignUpPageProps> = ({ onFormFocus }) => {
  const navigate = useNavigate();

  useEffect(() => {
    onFormFocus(); // 페이지 로드 시 오버레이 활성화
  }, [onFormFocus]);

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton 
        onClick={() => navigate('/login')}
        sx={{ 
          position: 'fixed',
          right: 20,
          top: 20,
          color: 'white',
          zIndex: 1200,
          padding: '12px',
          '&:hover': {
            color: '#e0e0e0'
          }
        }}
      >
        <CloseIcon sx={{ 
          fontSize: '2rem'
        }} />
      </IconButton>
      <AuthLayout>
        <SignUp />
      </AuthLayout>
    </Box>
  );
};

export default SignUpPage;