import { Notification, NotificationType } from '../types/notification.types';

export const getNotificationContent = (notification: Notification) => {
  const projectTitle = notification.project?.title || '삭제된 프로젝트';
  switch (notification.type) {
    case 'PROJECT_CREATED':
      return `새 프로젝트 "${projectTitle}"가 생성되었습니다.`;
    case 'PROJECT_DUE_SOON':
      return `프로젝트 "${projectTitle}"의 마감이 7일 남았습니다.`;
    case 'PROJECT_ENDED':
      return `프로젝트 "${projectTitle}"가 마감되었습니다.`;
    case 'PROJECT_CANCELED':
      return `프로젝트가 취소되었습니다.`;
    default:
      return '';
  }
};

export const getNotificationLabel = (type: NotificationType) => {
  switch (type) {
    case 'PROJECT_CREATED':
      return '신규';
    case 'PROJECT_DUE_SOON':
      return '마감임박';
    case 'PROJECT_ENDED':
      return '마감';
    case 'PROJECT_CANCELED':
      return '취소';
    default:
      return '';
  }
};

export const getNotificationColor = (type: NotificationType) => {
  switch (type) {
    case 'PROJECT_CREATED':
      return { color: '#1976d2', backgroundColor: '#e3f2fd' };
    case 'PROJECT_DUE_SOON':
      return { color: '#ed6c02', backgroundColor: '#fff7ed' };
    case 'PROJECT_ENDED':
      return { color: '#d32f2f', backgroundColor: '#ffeaea' };
    case 'PROJECT_CANCELED':
      return { color: '#d32f2f', backgroundColor: '#ffeaea' };
    default:
      return { color: 'grey.700', backgroundColor: 'grey.100' };
  }
}; 