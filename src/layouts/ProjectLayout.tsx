import { Box, Container } from '@mui/material';
import backgroundImage from '@/assets/images/background.png';
import Header from '../components/common/Header';
import Navbar from '../components/common/Navbar';

interface ProjectLayoutProps {
  children: React.ReactNode;
}

const ProjectLayout = ({ children }: ProjectLayoutProps) => {
  return (
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
      <Header />
      <Navbar />
      <Container 
        maxWidth="xl" 
        sx={{ 
          flex: 1,
          mt: 3,
          mb: 3,
        }}
      >
        {children}
      </Container>
    </Box>
  );
};

export default ProjectLayout; 