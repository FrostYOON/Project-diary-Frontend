import { createContext } from 'react';
import { Notification } from '../types/notification.types';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

export const NotificationContext = createContext<NotificationContextType | undefined>(undefined); 