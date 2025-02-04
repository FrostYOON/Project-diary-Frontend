import { SxProps } from '@mui/material';

export const notificationDetailStyle: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 1,
  mb: 1
};

export const notificationDateStyle: SxProps = {
  color: 'text.secondary',
  fontSize: '0.875rem'
};

export const notificationActionsStyle: SxProps = {
  position: 'absolute',
  right: 16,
  top: '50%',
  transform: 'translateY(-50%)',
  display: 'flex',
  gap: 1
};

export const notificationItemStyle: SxProps = {
  backgroundColor: '#fafafa',
  cursor: 'pointer',
  position: 'relative',
  pr: 12,
  py: 2,
  transition: 'opacity 0.2s ease',
  '&:hover': {
    backgroundColor: '#f5f5f5'
  }
};

export const actionButtonStyle = (type: 'read' | 'delete'): SxProps => ({
  color: type === 'delete' ? 'error.main' : 'primary.main',
  '&:hover': {
    backgroundColor: type === 'delete' ? 'error.light' : 'primary.light',
    color: 'white'
  }
}); 