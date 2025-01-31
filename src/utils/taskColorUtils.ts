import { TaskStatus, TaskPriority } from '../types/task.types';

export const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case '진행중':
      return { color: '#ed6c02', backgroundColor: '#fff7ed' };
    case '완료':
      return { color: '#2e7d32', backgroundColor: '#edf7ed' };
    case '대기':
      return { color: '#0288d1', backgroundColor: '#e3f2fd' };
    default:
      return { color: 'grey.700', backgroundColor: 'grey.100' };
  }
};

export const getPriorityColor = (priority: TaskPriority) => {
  switch (priority) {
    case '긴급':
      return { color: '#d32f2f', backgroundColor: '#ffeaea' };
    case '높음':
      return { color: '#ed6c02', backgroundColor: '#fff7ed' };
    case '보통':
      return { color: '#2e7d32', backgroundColor: '#edf7ed' };
    case '낮음':
      return { color: '#0288d1', backgroundColor: '#e3f2fd' };
    default:
      return { color: 'grey.700', backgroundColor: 'grey.100' };
  }
}; 