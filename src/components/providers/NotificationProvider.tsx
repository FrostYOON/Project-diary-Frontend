import { useState, useEffect, ReactNode, useCallback } from 'react';
import { Notification } from '../../types/notification.types';
import { getNotifications, markNotificationAsRead, deleteNotification as deleteNotificationApi } from '../../api/notification';
import { NotificationContext } from '../../contexts/NotificationContext';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const isLoggedIn = !!localStorage.getItem('accessToken');

  const refreshNotifications = useCallback(async () => {
    if (!isLoggedIn) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const data = await getNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => n.recipients?.length > 0).length);
    } catch (error) {
      console.error('알림 조회 실패:', error);
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [isLoggedIn]);

  const markAsRead = async (notificationId: string) => {
    if (!isLoggedIn) return;

    try {
      const notification = notifications.find(n => n._id === notificationId);
      if (notification?.readBy && notification.readBy.length > 0) {
        return;
      }

      const updatedNotification = await markNotificationAsRead(notificationId);
      if (updatedNotification) {
        setNotifications(prev => 
          prev.map(n => 
            n._id === notificationId 
              ? updatedNotification
              : n
          )
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
      throw error;
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await deleteNotificationApi(notificationId);
      setNotifications(prev => 
        prev.map(n => {
          if (n._id === notificationId) {
            return {
              ...n,
              readBy: []  // 서버에서 처리된 후 readBy를 비움
            };
          }
          return n;
        })
      );
    } catch (error) {
      console.error('알림 삭제 실패:', error);
      throw error;
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      refreshNotifications();
      const interval = setInterval(refreshNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn, refreshNotifications]);

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