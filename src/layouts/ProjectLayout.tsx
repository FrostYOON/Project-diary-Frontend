import { Box } from '@mui/material';
import Header from '../components/common/Header/Header';

interface ProjectLayoutProps {
    children: React.ReactNode;
}

const ProjectLayout = ({ children }: ProjectLayoutProps) => {
    return (
        <Box
            sx={{
                position: 'relative',
                width: '95%',
                margin: '0 auto',
            }}
        >
            <Header />
            <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
                <Box sx={{ 
                    flex: 1, 
                    overflow: 'auto', 
                    width: '100%',
                    height: 'calc(100vh - 63px)',
                }}>
                    {children}
                </Box>
            </Box>
        </Box>
    );
};

export default ProjectLayout; 