import { useState, useEffect, ReactNode } from 'react';
import { Notification } from '../types/notification.types';
import { getNotifications, markNotificationAsRead, deleteNotification as deleteNotificationApi } from '../api/notification';
import { NotificationContext } from './NotificationContext';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshNotifications = async () => {
    try {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('알림 조회 실패:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev => 
        prev.map(n => n._id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadCount(prev => prev - 1);
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await deleteNotificationApi(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  useEffect(() => {
    refreshNotifications();
    const interval = setInterval(refreshNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      refreshNotifications,
      markAsRead,
      deleteNotification
    }}>
      {children}
    </NotificationContext.Provider>
  );
}; 