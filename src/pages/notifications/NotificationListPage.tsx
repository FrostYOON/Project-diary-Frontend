import { Box, Typography, List, ListItem, ListItemText, Divider, Chip } from '@mui/material';
import { useNotification } from '../../hooks/useNotification';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getNotificationContent, getNotificationLabel, getNotificationColor } from '../../utils/notification';

const NotificationListPage = () => {
  const { notifications, markAsRead } = useNotification();

  const handleNotificationClick = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, margin: '0 auto', p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>알림 내역</Typography>
      <List>
        {notifications.map((notification, index) => (
          <Box key={notification._id}>
            <ListItem
              onClick={() => handleNotificationClick(notification._id)}
              sx={{
                backgroundColor: notification.isRead ? 'inherit' : '#fafafa',
                '&:hover': { backgroundColor: '#f5f5f5' },
                cursor: 'pointer'
              }}
            >
              <ListItemText
                primary={
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
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
                  <Typography
                    variant="caption"
                    sx={{ color: "text.secondary" }}
                  >
                    {format(new Date(notification.createdAt), "PPP", {
                      locale: ko,
                    })}
                  </Typography>
                }
              />
            </ListItem>
            {index < notifications.length - 1 && <Divider />}
          </Box>
        ))}
        {notifications.length === 0 && (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <Typography color="text.secondary">알림이 없습니다.</Typography>
          </Box>
        )}
      </List>
    </Box>
  );
};

export default NotificationListPage;
