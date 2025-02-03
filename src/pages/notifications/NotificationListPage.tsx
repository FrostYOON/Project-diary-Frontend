import { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  Box,
  Typography,
  Divider,
  CircularProgress,
  Tooltip,
} from "@mui/material";
import { Delete as DeleteIcon, CheckCircleOutline as CheckIcon, CheckCircle as CheckedIcon } from "@mui/icons-material";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { Notification, NotificationType } from "../../types/notification.types";
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from "../../api/notification";

const NotificationListPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  const getNotificationContent = (notification: Notification) => {
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

  const getNotificationColor = (type: NotificationType) => {
    switch (type) {
      case "PROJECT_CREATED":
        return { color: "#1976d2", backgroundColor: "#e3f2fd" };
      case "PROJECT_DUE_SOON":
        return { color: "#ed6c02", backgroundColor: "#fff7ed" };
      case "PROJECT_ENDED":
        return { color: "#d32f2f", backgroundColor: "#ffeaea" };
      case "PROJECT_CANCELED":
        return { color: "#d32f2f", backgroundColor: "#ffeaea" };
      default:
        return { color: "grey.700", backgroundColor: "grey.100" };
    }
  };

  const getNotificationLabel = (type: NotificationType) => {
    switch (type) {
      case "PROJECT_CREATED":
        return "신규";
      case "PROJECT_DUE_SOON":
        return "마감임박";
      case "PROJECT_ENDED":
        return "마감";
      case "PROJECT_CANCELED":
        return "취소";
      default:
        return "";
    }
  };

  const handleCheck = async (e: React.MouseEvent, notification: Notification) => {
    e.stopPropagation();
    try {
      if (!notification.isRead && notification.type !== 'PROJECT_CANCELED') {
        await markNotificationAsRead(notification._id);
        setNotifications(prev => 
          prev.map(n => 
            n._id === notification._id 
              ? { ...n, isRead: true }
              : n
          )
        );
      }
    } catch (error) {
      console.error('알림 읽음 처리 실패:', error);
    }
  };

  const handleDelete = async (e: React.MouseEvent, notificationId: string) => {
    e.stopPropagation();
    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n._id !== notificationId));
    } catch (error) {
      console.error('알림 삭제 실패:', error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await getNotifications();
        setNotifications(data);
      } catch (error) {
        console.error("알림 목록 조회 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: "white",
        borderRadius: 1,
        boxShadow: 1,
        mt: 2,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          borderBottom: "1px solid #eee",
        }}
      >
        <Box sx={{ flex: 1 }} />
        <Typography
          variant="h4"
          sx={{
            flex: 1,
            textAlign: "center",
            fontWeight: 500,
            color: "#333",
          }}
        >
          알림 내역
        </Typography>
        <Box sx={{ flex: 1 }} />
      </Box>

      <List sx={{ p: 0 }}>
        {loading ? (
          <Box sx={{ p: 4, textAlign: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          notifications.map((notification, index) => (
            <Box key={notification._id}>
              <ListItem
                sx={{
                  py: 2,
                  backgroundColor: notification.isRead ? 'inherit' : '#fafafa',
                }}
                secondaryAction={
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {notification.type !== 'PROJECT_CANCELED' && (
                      <Tooltip title={notification.isRead ? "읽음" : "확인"}>
                        <span>
                          <IconButton 
                            edge="end" 
                            aria-label="check"
                            onClick={(e) => handleCheck(e, notification)}
                            disabled={notification.isRead}
                            sx={{ 
                              color: notification.isRead ? 'success.main' : 'action.disabled',
                              '&.Mui-disabled': {
                                color: 'success.main',
                              }
                            }}
                          >
                            {notification.isRead ? <CheckedIcon /> : <CheckIcon />}
                          </IconButton>
                        </span>
                      </Tooltip>
                    )}
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={(e) => handleDelete(e, notification._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
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
          ))
        )}
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
