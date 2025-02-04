import { SxProps } from '@mui/material';

export const calendarHeaderStyle: SxProps = {
  display: 'flex', 
  justifyContent: 'space-between',
  mb: 3
};

export const calendarTitleStyle: SxProps = {
  flex: 1,
  textAlign: 'center'
};

export const legendContainerStyle: SxProps = {
  display: 'flex',
  gap: 2,
  flex: 1,
  justifyContent: 'flex-end'
};

export const legendItemStyle: SxProps = {
  display: 'flex',
  alignItems: 'center',
  gap: 0.5
};

export const legendColorBoxStyle = (color: string): SxProps => ({
  width: 16,
  height: 16,
  backgroundColor: color,
  borderRadius: 1
});

export const modalTitleStyle: SxProps = {
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

export const modalActionsStyle: SxProps = {
  p: 2,
  borderTop: '1px solid #eee',
  backgroundColor: '#f8f9fa'
};

export const closeButtonStyle: SxProps = {
  backgroundColor: '#F4A261',
  '&:hover': {
    backgroundColor: '#E76F51'
  }
};

export const calendarPageContainerStyle: SxProps = {
  height: 'calc(100vh - 90px)',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  opacity: 0.9
};

export const calendarContainerStyle: SxProps = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
  p: 2.5,
  backgroundColor: 'white',
  borderRadius: 1,
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'
};

export const calendarWrapperStyle: SxProps = {
  flex: 1,
  overflow: 'auto',
  '& .rbc-calendar': {
    '& .rbc-row-bg .rbc-day-bg:first-child, & .rbc-row .rbc-date-cell:first-child': {
      backgroundColor: '#fff1f0 !important',
      color: '#ff4d4f !important'
    },
    '& .rbc-header:first-child': {
      backgroundColor: '#fff1f0 !important',
      color: '#ff4d4f !important'
    },
    '& .rbc-row-bg .rbc-day-bg:last-child, & .rbc-row .rbc-date-cell:last-child': {
      backgroundColor: '#f0f5ff !important',
      color: '#1890ff !important'
    },
    '& .rbc-header:last-child': {
      backgroundColor: '#f0f5ff !important',
      color: '#1890ff !important'
    }
  }
};

export const calendarEventStyle = (status: string) => ({
  backgroundColor: 
    status === '완료' ? '#4CAF50' :
    status === '진행중' ? '#F4A261' :
    status === '보류' ? '#9E9E9E' : '#90CAF9',
  borderRadius: '4px'
});