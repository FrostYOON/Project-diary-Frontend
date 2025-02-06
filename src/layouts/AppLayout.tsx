import { Box } from '@mui/material';
import Header from '../components/common/Header/Header';
import Navbar from '../components/common/Navbar';
import RootLayout from './RootLayout';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { rootLayoutStyle, contentLayoutStyle, mainContentStyle } from '../styles/layouts/layout.styles';

interface AppLayoutProps {
  children: React.ReactNode;
  hideHeader?: boolean;
}

const AppLayout = ({ children, hideHeader = false }: AppLayoutProps) => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const navWidth = isNavExpanded ? '240px' : '64px'; // 네비바 너비 상태
  const location = useLocation();
  const isMainPage = location.pathname === '/';

  return (
    <RootLayout isOverlayVisible={false}>
      <Box sx={rootLayoutStyle}>
        <Box sx={{ width: navWidth, flexShrink: 0 }}>
          <Navbar onOpenChange={setIsNavExpanded} />
        </Box>
        <Box sx={{
          ...contentLayoutStyle,
          width: `calc(100% - ${navWidth})`
        }}>
          {!hideHeader && !isMainPage && <Header />}
          <Box sx={mainContentStyle}>
            {children}
          </Box>
        </Box>
      </Box>
    </RootLayout>
  );
};

export default AppLayout; 