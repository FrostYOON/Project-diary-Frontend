import { SxProps } from '@mui/material';

export const notificationItemStyle: SxProps = {
  backgroundColor: '#fafafa',
  cursor: 'pointer',
  position: 'relative',
  pr: 12,
  py: 2,
  transition: 'all 0.1s ease',
  '&:hover': {
    backgroundColor: '#f5f5f5'
  }
};

export const notificationContentStyle: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mb: 1
};

export const notificationListContainerStyle: SxProps = {
  height: 'calc(100vh - 100px)',
  overflow: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 1,
  opacity: 0.9
};

export const actionButtonStyle = (type: 'read' | 'delete'): SxProps => ({
  color: type === 'delete' ? 'error.main' : 'primary.main',
  transition: 'all 0.1s ease',
  '&:hover': {
    backgroundColor: type === 'delete' ? 'error.light' : 'primary.light',
    color: 'white'
  }
}); 