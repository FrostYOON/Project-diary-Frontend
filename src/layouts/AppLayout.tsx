import { Box } from '@mui/material';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';
import RootLayout from './RootLayout';
import { useState } from 'react';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout = ({ children }: AppLayoutProps) => {
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const navWidth = isNavExpanded ? '240px' : '64px'; // 네비바 너비 상태

  return (
    <RootLayout isOverlayVisible={false}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <Box sx={{ width: navWidth, flexShrink: 0 }}>
          <Navbar onOpenChange={setIsNavExpanded} />
        </Box>
        <Box sx={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column',
          transition: 'margin-left 0.2s ease-in-out',
          marginLeft: '0',
          width: `calc(100% - ${navWidth})`,
        }}>
          <Header />
          <Box sx={{ 
            flex: 1, 
            overflow: 'auto',
            height: 'calc(100vh - 63px)',
            p: 1
          }}>
            {children}
          </Box>
        </Box>
      </Box>
    </RootLayout>
  );
};

export default AppLayout; 