import { Box, Container } from '@mui/material';
import styled from 'styled-components';
import { useEffect, useState } from 'react';
import backgroundImage from '@/assets/images/background.png';
import logo from '../assets/images/logo.png';
import Navbar from '../components/common/Navbar';
import Header from '../components/common/Header';

const MainPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // URL에서 토큰 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    
    if (accessToken) {
      // localStorage에 토큰 저장
      localStorage.setItem('accessToken', accessToken);
      // URL에서 토큰 제거
      window.history.replaceState({}, document.title, '/');
    }

    // 로그인 상태 확인
    setIsLoggedIn(!!localStorage.getItem('accessToken'));
  }, []);

  return (
    <PageContainer>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {isLoggedIn && <Header />}
        <Navbar />
        <Container 
          maxWidth="xl" 
          sx={{ 
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <LogoContainer>
            <Logo src={logo} alt="logo" />
          </LogoContainer>
        </Container>
      </Box>
    </PageContainer>
  );
};

const PageContainer = styled.div`
  height: 100vh;
  overflow: hidden;
  position: relative;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  max-width: 600px;
  height: auto;
`;

export default MainPage;