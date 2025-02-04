import { useState } from 'react';
import {
  IconButton,
  Badge,
  Popover,
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Chip,
  Divider
} from '@mui/material';
import { Notifications as NotificationIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../../../hooks/useNotification';
import { getNotificationLabel, getNotificationColor, getNotificationContent } from '../../../../utils/notification';

const NotificationPopover = () => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { notifications, unreadCount, markAsRead } = useNotification();
  const navigate = useNavigate();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleViewAll = () => {
    navigate('/notifications');
    handleClose();
  };

  const handleNotificationClick = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleClick}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationIcon />
        </Badge>
      </IconButton>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { width: 400, maxHeight: 500 }
        }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6">알림</Typography>
          <Typography 
            variant="body2" 
            sx={{ cursor: 'pointer', color: 'primary.main' }}
            onClick={handleViewAll}
          >
            전체보기
          </Typography>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary={
                  <Typography color="text.secondary" align="center">
                    새로운 알림이 없습니다.
                  </Typography>
                }
              />
            </ListItem>
          ) : (
            notifications.slice(0, 5).map((notification, index) => (
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Chip
                          label={getNotificationLabel(notification.type)}
                          size="small"
                          sx={getNotificationColor(notification.type)}
                        />
                        <Typography variant="body2" noWrap>
                          {getNotificationContent(notification)}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(notification.createdAt), 'PPP', { locale: ko })}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </Box>
            ))
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationPopover; 