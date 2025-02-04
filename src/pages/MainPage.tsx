import { Box } from '@mui/material';
import { useEffect } from 'react';
import logo from '../assets/images/logo.png';

const MainPage = () => {
  useEffect(() => {
    // URL에서 토큰 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      window.history.replaceState({}, document.title, '/');
    }
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10
      }}
    >
      <Box
        component="img"
        src={logo}
        alt="logo"
        sx={{
          width: 300,
          height: 'auto',
          opacity: 0.9,
          transition: 'opacity 0.3s ease',
          '&:hover': {
            opacity: 1
          }
        }}
      />
    </Box>
  );
};

export default MainPage;