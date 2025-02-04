import { useState, useEffect, ReactNode } from 'react';
import { Notification } from '../../types/notification.types';
import { getNotifications, markNotificationAsRead, deleteNotification as deleteNotificationApi } from '../../api/notification';
import { NotificationContext } from '../../contexts/NotificationContext';

export const NotificationProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const refreshNotifications = async () => {
    try {
      const data = await getNotifications(); // 서버에서 이미 필터링된 알림만 받아옴
      
      setNotifications(data);
      setUnreadCount(data.filter(n => n.recipients?.length > 0).length);
    } catch (error) {
      console.error('알림 조회 실패:', error);
    }
  };

  const markAsRead = async (notificationId: string) => {
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