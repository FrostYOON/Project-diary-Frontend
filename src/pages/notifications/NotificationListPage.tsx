import { Box, Typography, List, ListItem, ListItemText, Divider, Chip, Button } from '@mui/material';
import { useNotification } from '../../hooks/useNotification';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { getNotificationContent, getNotificationLabel, getNotificationColor } from '../../utils/notification';
import { Delete as DeleteIcon, Check as CheckIcon } from '@mui/icons-material';
import { Notification } from '../../types/notification.types';
import { 
  notificationListContainerStyle,
  notificationItemStyle,
} from '../../styles/components/notification.styles';
import {
  notificationDetailStyle,
  notificationDateStyle,
  notificationActionsStyle,
  actionButtonStyle,
} from '../../styles/components/notification.detail.styles';

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

  // const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
  //   e.stopPropagation();
  //   try {
  //     await deleteNotification(notificationId);
  //   } catch (error) {
  //     console.error('알림 삭제 실패:', error);
  //   }
  // };

  return (
    <Box sx={notificationListContainerStyle}>
      <Typography variant="h4" sx={{ m: 2, textAlign: 'center' }}>알림 내역</Typography>
      <Box sx={{ 
        height: '100vh - 65px',
        overflow: 'auto',  // 스크롤 추가
        bgcolor: 'background.paper',
        borderRadius: 2,
        boxShadow: 1,
      }}>
        <List>
          {notifications.map((notification, index) => (
            <Box key={notification._id}>
              <ListItem
                onClick={() => handleNotificationClick(notification)}
                sx={{
                  ...notificationItemStyle,
                  opacity: notification.recipients?.length === 0 ? 0.6 : 1
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={notificationDetailStyle}>
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
                    <Typography sx={notificationDateStyle}>
                      {format(new Date(notification.createdAt), "PPP", { locale: ko })}
                    </Typography>
                  }
                />
                <Box sx={notificationActionsStyle}>
                  <Button
                    size="small"
                    startIcon={<CheckIcon />}
                    onClick={() => markAsRead(notification._id)}
                    sx={actionButtonStyle('read')}
                  >
                    읽음
                  </Button>
                  <Button
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteNotification(notification._id)}
                    sx={actionButtonStyle('delete')}
                  >
                    삭제
                  </Button>
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
    </Box>
  );
};

export default NotificationListPage;
