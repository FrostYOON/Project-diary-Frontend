import { SxProps, Theme } from '@mui/material';

export const changePasswordContainerStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: 'calc(100vh - 64px)',  // 헤더 높이 고려
  padding: '20px'
};

export const changePasswordPaperStyle: SxProps<Theme> = {
  p: 4,
  width: '100%',
  maxWidth: '500px',
  borderRadius: 2,
  boxShadow: 3
};

export const changePasswordFormStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  gap: 3
};

export const buttonGroupStyle: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: 2,
  mt: 3
};

export const submitButtonStyle: SxProps<Theme> = {
  backgroundColor: '#F4A261',
  '&:hover': {
    backgroundColor: '#E76F51'
  }
};

export const passwordFieldStyle: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 1,
    backgroundColor: '#fff'
  }
}; 