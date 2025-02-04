import { SxProps } from '@mui/material';

export const calendarContainerStyle: SxProps = {
  height: 'calc(100vh - 100px)',
  p: 2,
  backgroundColor: 'background.paper',
  borderRadius: 2,
  boxShadow: 1
};

export const calendarHeaderStyle: SxProps = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  mb: 2
};

export const calendarEventStyle: SxProps = {
  backgroundColor: 'primary.light',
  color: 'white',
  p: 0.5,
  borderRadius: 1,
  fontSize: '0.875rem',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: 'primary.main'
  }
}; 