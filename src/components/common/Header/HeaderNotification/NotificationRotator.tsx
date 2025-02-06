import { useState } from 'react';
import { Box, Typography, Chip } from '@mui/material';
import { useNotification } from '../../../../hooks/useNotification';
import { getNotificationContent, getNotificationLabel, getNotificationColor } from '../../../../utils/notification';

const NotificationRotator = () => {
  const { notifications } = useNotification();
  const [key, setKey] = useState(0);

  const handleAnimationEnd = () => {
    setKey(prev => prev + 1);
  };

  if (notifications.length === 0) return null;

  const latestNotification = notifications[0];

  return (
    <Box sx={{ 
      position: 'relative',
      height: '38px',
      width: '400px',
      overflow: 'hidden',
      ml: 2
    }}>
      <Box 
        key={key}
        onAnimationEnd={handleAnimationEnd}
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          padding: '4px 12px',
          position: 'absolute',
          width: '100%',
          height: '100%',
          transform: 'translateX(-100%)',
          animation: 'slideLeft 15s linear',
          '@keyframes slideLeft': {
            '0%': {
              transform: 'translateX(-100%)',
            },
            '100%': {
              transform: 'translateX(100%)',
            },
          },
        }}
      >
        <Chip
          label={getNotificationLabel(latestNotification.type)}
          size="small"
          sx={{
            ...getNotificationColor(latestNotification.type),
            height: '24px',
            minWidth: '70px'
          }}
        />
        <Typography variant="body2" sx={{ 
          color: '#4a5568',
          whiteSpace: 'nowrap',
          fontSize: '18px',
          fontWeight: 500
        }}>
          {getNotificationContent(latestNotification)}
        </Typography>
      </Box>
    </Box>
  );
};

export default NotificationRotator;
