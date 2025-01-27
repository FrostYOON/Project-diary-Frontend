import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  List, 
  ListItemIcon, 
  ListItemText, 
  Tooltip, 
  useTheme, 
  useMediaQuery,
  Box 
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ListIcon from '@mui/icons-material/List';
import NotificationsIcon from '@mui/icons-material/Notifications';
import logo from '../../assets/images/logo.png';
import { MenuItem } from '../../types/navbar.types';
import { 
  StyledDrawer, 
  StyledListItem, 
} from '../../styles/navbar.styles';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 토큰 존재 여부로 로그인 상태 확인
    const token = localStorage.getItem('accessToken');
    setIsLoggedIn(!!token);
  }, [location]); // 페이지 변경시마다 체크

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    navigate('/');
  };

  const getMenuItems = () => {
    const baseItems: MenuItem[] = [
      { 
        type: 'logo',
        text: '',
        icon: (
          <Box
            component="img"
            src={logo}
            sx={{
              width: open ? 150 : 24,
              height: 'auto',
              objectFit: 'contain',
              transition: theme.transitions.create('width', {
                duration: theme.transitions.duration.shorter,
              }),
            }}
          />
        ), 
        path: '/' 
      }
    ];

    const mainMenuItems: MenuItem[] = [
      { text: '프로젝트 현황', icon: <CalendarMonthIcon />, path: '/projectCalendar' },
      { text: '프로젝트 목록', icon: <ListAltIcon />, path: '/projects' },
      { text: '개인 목록', icon: <ListIcon />, path: '/tasks' },
    ];

    const bottomMenuItems: MenuItem[] = isLoggedIn ? [
      { text: '알림 내역', icon: <NotificationsIcon />, path: '/notifications' },
      { text: '마이페이지', icon: <AccountCircleIcon />, path: '/mypage' },
      { text: '로그아웃', icon: <LogoutIcon />, onClick: handleLogout }
    ] : [
      { text: '로그인', icon: <LoginIcon />, path: '/login' },
      { text: '회원가입', icon: <PersonAddIcon />, path: '/signup' }
    ];

    return { baseItems, mainMenuItems, bottomMenuItems };
  };

  const { baseItems, mainMenuItems, bottomMenuItems } = getMenuItems();

  const handleMouseEnter = () => {
    if (!isMobile) setOpen(true);
  };

  const handleMouseLeave = () => {
    if (!isMobile) setOpen(false);
  };

  const handleItemClick = (item: MenuItem) => {
    if (item.onClick) {
      item.onClick();
    } else if (item.path) {
      navigate(item.path);
    }
    if (isMobile) setOpen(false);
  };

  return (
    <StyledDrawer
      variant={isMobile ? "temporary" : "permanent"}
      open={open}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClose={() => setOpen(false)}
    >
      <List sx={{ mt: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* 로고 */}
        {baseItems.map((item, index) => (
          <Box 
            key={index} 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              width: '100%',
              '& .MuiListItem-root': {
                justifyContent: 'center',
                px: 0,
              },
              '& .MuiListItemIcon-root': {
                minWidth: 'auto',
                justifyContent: 'center'
              }
            }}
          >
            <Tooltip title={!open && item.text ? item.text : ''} placement="right">
              <StyledListItem
                onClick={() => handleItemClick(item)}
                active={item.path && location.pathname === item.path ? 1 : 0}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                {item.text && (
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: theme.transitions.create('opacity', {
                        duration: theme.transitions.duration.shorter,
                      }),
                    }} 
                  />
                )}
              </StyledListItem>
            </Tooltip>
          </Box>
        ))}

        {/* 메인 메뉴 아이템 - 로그인 상태일 때만 표시 */}
        {isLoggedIn && (
          <Box sx={{ mt: 2 }}>
            {mainMenuItems.map((item, index) => (
              <Tooltip key={index} title={!open && item.text ? item.text : ''} placement="right">
                <StyledListItem
                  onClick={() => handleItemClick(item)}
                  active={item.path && location.pathname === item.path ? 1 : 0}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText 
                    primary={item.text}
                    sx={{
                      opacity: open ? 1 : 0,
                      transition: theme.transitions.create('opacity', {
                        duration: theme.transitions.duration.shorter,
                      }),
                    }} 
                  />
                </StyledListItem>
              </Tooltip>
            ))}
          </Box>
        )}

        {/* 하단 메뉴 아이템 */}
        <Box sx={{ mt: 'auto' }}>
          {bottomMenuItems.map((item, index) => (
            <Tooltip key={index} title={!open && item.text ? item.text : ''} placement="right">
              <StyledListItem
                onClick={() => handleItemClick(item)}
                active={item.path && location.pathname === item.path ? 1 : 0}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText 
                  primary={item.text}
                  sx={{
                    opacity: open ? 1 : 0,
                    transition: theme.transitions.create('opacity', {
                      duration: theme.transitions.duration.shorter,
                    }),
                  }} 
                />
              </StyledListItem>
            </Tooltip>
          ))}
        </Box>
      </List>
    </StyledDrawer>
  );
};

export default Navbar;