import { SxProps } from '@mui/material';

export const rootLayoutStyle: SxProps = {
  display: 'flex',
  minHeight: '100vh'
};

export const contentLayoutStyle: SxProps = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  transition: 'margin-left 0.2s ease-in-out',
  marginLeft: '0',
};

export const mainContentStyle: SxProps = {
  flex: 1,
  overflow: 'auto',
  p: 1
}; 