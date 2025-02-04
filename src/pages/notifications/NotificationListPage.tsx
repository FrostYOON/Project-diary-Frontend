import { Box, Typography, List, ListItem, ListItemText, Divider, Chip, IconButton } from '@mui/material';
import { useNotification } from '../../hooks/useNotification';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getNotificationContent, getNotificationLabel, getNotificationColor } from '../../utils/notification';
import { Delete as DeleteIcon } from '@mui/icons-material';
import { Notification } from '../../types/notification.types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const NotificationListPage = () => {
  const { notifications, markAsRead, deleteNotification } = useNotification();

  const handleNotificationClick = async (notification: Notification) => {
    try {
      if (notification.recipients?.length > 0) {
        await markAsRead(notification._id);
      }
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const handleCheck = async (e: React.MouseEvent, notification: Notification) => {
    e.stopPropagation();
    if (notification.readBy && notification.readBy.length > 0) return;
    
    try {
      await markAsRead(notification._id);
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 1000, margin: '0 auto', p: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center' }}>알림 내역</Typography>
      <List>
        {notifications.map((notification, index) => (
          <Box key={notification._id}>
            <ListItem
              onClick={() => handleNotificationClick(notification)}
              sx={{
                backgroundColor: '#fafafa',
                opacity: notification.recipients?.length ? 1 : 0.6,
                cursor: 'pointer',
                position: 'relative',
                pr: 12,
                py: 2,
                borderRadius: 4,
                transition: 'opacity 0.2s ease'
              }}
            >
              <ListItemText
                primary={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <Chip
                      label={getNotificationLabel(notification.type)}
                      size="small"
                      sx={getNotificationColor(notification.type)}
                    />
                    <Typography variant="body1">
                      {getNotificationContent(notification)}
                    </Typography>
                  </Box>
                }
                secondary={
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {format(new Date(notification.createdAt), "PPP", { locale: ko })}
                  </Typography>
                }
              />
              <Box sx={{ 
                position: 'absolute', 
                right: 16, 
                display: 'flex', 
                alignItems: 'center',
                gap: 1
              }}>
                <CheckCircleIcon 
                  onClick={(e) => handleCheck(e, notification)}
                  sx={{ 
                    color: notification.readBy?.length ? '#4CAF50' : '#e0e0e0',
                    '&:hover': {
                      color: notification.recipients?.length ? '#4CAF50' : '#e0e0e0'
                    },
                    fontSize: 20,
                    cursor: notification.recipients?.length ? 'pointer' : 'default'
                  }} 
                />
                <IconButton
                  size="small"
                  aria-label="delete"
                  onClick={(e) => handleDelete(e, notification._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            </ListItem>
            {index < notifications.length - 1 && <Divider />}
          </Box>
        ))}
        {notifications.length === 0 && (
          <Box sx={{ p: 6, textAlign: "center" }}>
            <Typography color="text.secondary">알림이 없습니다.</Typography>
          </Box>
        )}
      </List>
    </Box>
  );
};

export default NotificationListPage;
