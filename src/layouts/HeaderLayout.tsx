import { Box } from '@mui/material';
import Header from '../components/common/Header';

const HeaderLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%'
    }}>
      <Header />
      <Box sx={{ 
        flex: 1,
        width: '100%'
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default HeaderLayout;