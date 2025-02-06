import { SxProps } from '@mui/material';
import { TaskStatus, TaskPriority } from '../../types/task.types';

export const taskTableContainerStyle: SxProps = {
  width: '100%',
  height: 'calc(100vh - 140px)',
  bgcolor: 'white',
  borderRadius: 2,
  overflow: 'hidden'
};

export const dataGridStyle: SxProps = {
  '& .MuiDataGrid-cell': {
    borderColor: 'grey.200',
    textAlign: 'center',
    justifyContent: 'center'
  },
  '& .MuiDataGrid-row:hover': {
    cursor: 'pointer',
    backgroundColor: 'rgba(0, 0, 0, 0.04)'
  },
  '& .MuiDataGrid-columnHeaders': {
    borderRadius: '8px 8px 0 0',
    textAlign: 'center'
  },
  '& .MuiDataGrid-columnHeader': {
    backgroundColor: '#D4A373',
    color: '#ffffff',
    fontWeight: 'bold'
  }
};

export const getStatusChipStyle = (status: TaskStatus): SxProps => {
  const colors = {
    '진행중': { color: '#ed6c02', backgroundColor: '#fff7ed' },
    '완료': { color: '#2e7d32', backgroundColor: '#edf7ed' },
    '대기': { color: '#0288d1', backgroundColor: '#e3f2fd' },
    '보류': { color: '#9e9e9e', backgroundColor: '#f5f5f5' }
  };
  
  return {
    ...colors[status] || { color: 'grey.700', backgroundColor: 'grey.100' },
    fontWeight: 'medium'
  };
};

export const getPriorityChipStyle = (priority: TaskPriority): SxProps => {
  const colors = {
    '긴급': { color: '#d32f2f', backgroundColor: '#ffeaea' },
    '높음': { color: '#ed6c02', backgroundColor: '#fff7ed' },
    '보통': { color: '#2e7d32', backgroundColor: '#edf7ed' },
    '낮음': { color: '#0288d1', backgroundColor: '#e3f2fd' }
  };

  return {
    ...colors[priority] || { color: 'grey.700', backgroundColor: 'grey.100' },
    fontWeight: 'medium'
  };
};

export const expiredChipStyle: SxProps = {
  backgroundColor: '#ff4d4f',
  color: 'white',
  fontWeight: 500
};

export const deadlineChipStyle: SxProps = {
  backgroundColor: '#faad14',
  color: 'white',
  fontWeight: 500
}; 

export const modalStyle: SxProps = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 0
};

export const modalTitleStyle: SxProps = {
  borderBottom: '1px solid #eee',
  backgroundColor: '#f8f9fa',
  textAlign: 'center',
};

export const modalContentStyle: SxProps = {
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3
};

export const modalActionsStyle: SxProps = {
  p: 2,
  borderTop: '1px solid #eee',
  backgroundColor: '#f8f9fa'
};

export const submitButtonStyle: SxProps = {
  backgroundColor: '#F4A261',
  '&:hover': {
    backgroundColor: '#E76F51'
  }
};

export const formGroupStyle: SxProps = {
  display: 'flex',
  gap: 2
};

export const textFieldStyle: SxProps = {
  '& .MuiInputLabel-root': {
    backgroundColor: 'white',
    px: 0.5
  }
};

export const descriptionFieldStyle: SxProps = {
  '& .MuiInputBase-root': {
    height: '100px'
  },
  '& .MuiInputLabel-root': {
    backgroundColor: 'white',
    px: 0.5
  }
};