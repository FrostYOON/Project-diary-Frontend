import { useEffect } from 'react';
import { Login } from '../../components/auth/Login';
import AuthLayout from '../../layouts/AuthLayout';
import { Box, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { iconButtonStyle } from '../../styles/common/buttons';

interface LoginPageProps {
  onFormFocus: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onFormFocus }) => {
  const navigate = useNavigate();

  useEffect(() => {
    onFormFocus();
  }, [onFormFocus]);

  return (
    <Box sx={{ position: 'relative' }}>
      <IconButton 
        onClick={() => navigate('/')}
        sx={iconButtonStyle}
      >
        <CloseIcon sx={{ fontSize: '2rem' }} />
      </IconButton>
      <AuthLayout>
        <Login />
      </AuthLayout>
    </Box>
  );
};

export default LoginPage;