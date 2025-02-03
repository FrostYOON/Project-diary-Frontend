import { axiosInstance } from './axios.config';
import { Notification } from '../types/notification.types';

export const getNotifications = async () => {
  const response = await axiosInstance.get<{ success: boolean; data: { notifications: Notification[] } }>('/notifications');
  return response.data.data.notifications;
};

export const markNotificationAsRead = async (notificationId: string) => {
  const response = await axiosInstance.patch<{ success: boolean; data: { notification: Notification } }>(
    `/notifications/${notificationId}/read`
  );
  return response.data.data.notification;
};

export const deleteNotification = async (notificationId: string) => {
  const response = await axiosInstance.delete<{ success: boolean }>(
    `/notifications/${notificationId}`
  );
  return response.data.success;
}; 