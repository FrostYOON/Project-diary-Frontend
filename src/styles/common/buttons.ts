import { SxProps } from '@mui/material';

export const primaryButtonStyle: SxProps = {
  backgroundColor: '#F4A261',
  '&:hover': {
    backgroundColor: '#E76F51',
  },
};

export const iconButtonStyle: SxProps = {
  position: 'fixed',
  right: 20,
  top: 20,
  color: 'white',
  zIndex: 1200,
  padding: '12px',
  '&:hover': {
    color: '#e0e0e0'
  }
}; 