import { Box } from '@mui/material';
import React from 'react';
import backgroundImage from '@/assets/images/background.png';  // 배경 이미지 import

interface RootLayoutProps {
  children: React.ReactNode;
  isOverlayVisible: boolean; // 오버레이 표시 여부를 결정하는 props
}

const RootLayout = ({ children, isOverlayVisible }: RootLayoutProps) => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        '&::before': {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url("/assets/images/background.png")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed',
          zIndex: 0,
        },
        ...(isOverlayVisible && {
          '&::after': {
            content: '""',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1,
          },
        }),
      }}
    >
      <Box sx={{ position: 'relative', zIndex: 2 }}>
        {children}
      </Box>
    </Box>
  );
};

export default RootLayout;