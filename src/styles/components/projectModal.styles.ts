import { SxProps } from '@mui/material';

export const modalStyle: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 800,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  maxHeight: '90vh',
  overflow: 'auto'
};

export const modalTitleStyle: SxProps = {
  mb: 3,
  borderBottom: '1px solid #eee',
  backgroundColor: '#f8f9fa',
  px: 3,
  py: 2
};

export const modalContentStyle: SxProps = {
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  gap: 2
};

export const formBoxStyle: SxProps = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  mt: 1
};

export const modalActionsStyle: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  mt: 4,
  borderTop: '1px solid #eee',
  pt: 3,
  px: 3,
  pb: 2
};

export const textFieldStyle: SxProps = {
  '& .MuiInputLabel-root': {
    backgroundColor: 'white',
    px: 0.5
  }
};

export const submitButtonStyle: SxProps = {
  backgroundColor: '#F4A261',
  '&:hover': {
    backgroundColor: '#E76F51'
  }
};