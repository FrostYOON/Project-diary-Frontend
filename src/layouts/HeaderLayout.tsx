import { Box } from '@mui/material';
import Header from '../components/common/Header';

const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Header />
      <Box sx={{ 
        flex: 1,
        mt: '64px'  // 헤더 높이만큼 여백
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default HeaderLayout;