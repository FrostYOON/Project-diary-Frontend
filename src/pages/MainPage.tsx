import { Box } from '@mui/material';
import { useEffect } from 'react';
import logo from '../assets/images/logo.png';
import { centeredContainerStyle } from '../styles/common/containers';
import { logoStyle } from '../styles/components/logo.styles';

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
    <Box sx={centeredContainerStyle}>
      <Box
        component="img"
        src={logo}
        alt="logo"
        sx={logoStyle}
      />
    </Box>
  );
};

export default MainPage;