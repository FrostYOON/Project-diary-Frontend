import { SxProps } from '@mui/material';

export const modalContainerStyle: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4
};

export const modalHeaderStyle: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 3
};

export const modalActionStyle: SxProps = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 2,
  mt: 3
}; 