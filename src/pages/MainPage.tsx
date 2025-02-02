import styled from 'styled-components';
import { useEffect, useState } from 'react';
import logo from '../assets/images/logo.png';
import RootLayout from '../layouts/RootLayout';
import AppLayout from '../layouts/AppLayout';

const MainPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // URL에서 토큰 파라미터 확인
    const urlParams = new URLSearchParams(window.location.search);
    const accessToken = urlParams.get('accessToken');
    
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
      window.history.replaceState({}, document.title, '/');
    }

    setIsLoggedIn(!!localStorage.getItem('accessToken'));
  }, []);

  const MainContent = () => (
    <CenteredContainer>
      <LogoContainer>
        <Logo src={logo} alt="logo" />
      </LogoContainer>
    </CenteredContainer>
  );

  return isLoggedIn ? (
    <AppLayout>
      <MainContent />
    </AppLayout>
  ) : (
    <RootLayout isOverlayVisible={false}>
      <MainContent />
    </RootLayout>
  );
};

const CenteredContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10;
`;

const LogoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Logo = styled.img`
  width: 300px;
  height: auto;
  opacity: 0.9;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 1;
  }
`;

export default MainPage;