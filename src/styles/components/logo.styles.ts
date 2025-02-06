import { SxProps } from '@mui/material';

export const logoStyle: SxProps = {
  width: 300,
  height: 'auto',
  opacity: 0.9,
  transition: 'opacity 0.3s ease',
  '&:hover': {
    opacity: 1
  }
};

export const navLogoStyle = (open: boolean): SxProps => ({
  width: open ? 150 : 24,
  height: 'auto',
  objectFit: 'contain',
  transition: 'width 0.3s ease'
}); 