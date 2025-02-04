import { SxProps } from '@mui/material';

export const taskItemStyle: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 2,
  p: 2,
  borderRadius: 1,
  backgroundColor: 'background.paper',
  mb: 1,
  '&:hover': {
    backgroundColor: 'action.hover'
  }
};

export const taskStatusStyle = (status: string): SxProps => ({
  color: status === 'completed' ? 'success.main' : 'warning.main',
  fontWeight: 'medium'
});

export const taskActionsStyle: SxProps = {
  display: 'flex',
  gap: 1,
  ml: 'auto'
}; 