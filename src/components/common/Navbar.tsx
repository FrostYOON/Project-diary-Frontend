import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItemIcon, 
  ListItemText, 
  useTheme, 
  useMediaQuery,
  ListItemButton
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
import { 
  drawerStyle, 
  miniDrawerStyle, 
  logoStyle, 
  listItemStyle, 
  selectedListItemStyle, 
  listItemIconStyle, 
  listItemTextStyle,
  navListStyle,
  bottomListStyle,
  logoItemStyle,
  logoSectionStyle,
  mainMenuSectionStyle
} from '../../styles/components/navbar.styles';
import { authService } from '../../api/auth.api';

interface NavbarProps {
  onOpenChange: (open: boolean) => void;
}

const Navbar = ({ onOpenChange }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 토큰 존재 여부로 로그인 상태 확인
    const accessToken = localStorage.getItem('accessToken');
    setIsLoggedIn(!!accessToken);
  }, [location]); // 페이지 변경시마다 체크

  useEffect(() => {
    onOpenChange(open);
  }, [open, onOpenChange]);

  const handleLogout = async () => {
    try {
      localStorage.removeItem('accessToken');
      await authService.logout();  // 서버에 로그아웃 요청
      setIsLoggedIn(false);
      navigate('/');
    } catch (error) {
      console.error('로그아웃 실패:', error);
      // 실패해도 일단 로그아웃 처리
      setIsLoggedIn(false);
      navigate('/');
    }
  };

  const mainMenuItems = [
    { text: '프로젝트 현황', icon: <CalendarMonthIcon />, path: '/projectCalendar' },
    { text: '프로젝트 목록', icon: <ListAltIcon />, path: '/projects' },
    { text: '업무 목록', icon: <ListIcon />, path: '/tasks' },
  ];

  const bottomMenuItems = isLoggedIn ? [
    { text: '알림 내역', icon: <NotificationsIcon />, path: '/notifications' },
    { text: '마이페이지', icon: <AccountCircleIcon />, path: '/mypage' },
    { text: '로그아웃', icon: <LogoutIcon />, onClick: handleLogout }
  ] : [
    { text: '로그인', icon: <LoginIcon />, path: '/login' },
    { text: '회원가입', icon: <PersonAddIcon />, path: '/signup' }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={open ? drawerStyle : miniDrawerStyle}
      onMouseEnter={() => !isMobile && setOpen(true)}
      onMouseLeave={() => !isMobile && setOpen(false)}
    >
      <List sx={navListStyle}>
        {/* 로고 섹션 */}
        <Box sx={logoSectionStyle}>
          <ListItemButton
            key="logo"
            onClick={() => navigate('/')}
            sx={logoItemStyle}
          >
            <Box
              component="img"
              src={logo}
              sx={logoStyle(open)}
            />
          </ListItemButton>
        </Box>

        {/* 메인 메뉴 섹션 - 로그인된 경우에만 표시 */}
        {isLoggedIn && (
          <Box sx={mainMenuSectionStyle}>
            {mainMenuItems.map((item) => (
              <ListItemButton
                key={item.path}
                onClick={() => item.path && navigate(item.path)}
                sx={location.pathname === item.path ? selectedListItemStyle : listItemStyle}
              >
                <ListItemIcon sx={listItemIconStyle}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  sx={listItemTextStyle(open)}
                />
              </ListItemButton>
            ))}
          </Box>
        )}

        {/* 하단 메뉴 섹션 */}
        <Box sx={bottomListStyle}>
          {bottomMenuItems.map((item) => (
            <ListItemButton
              key={item.text}
              onClick={item.onClick ? item.onClick : item.path ? () => navigate(item.path) : undefined}
              sx={location.pathname === item.path ? selectedListItemStyle : listItemStyle}
            >
              <ListItemIcon sx={listItemIconStyle}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={listItemTextStyle(open)}
              />
            </ListItemButton>
          ))}
        </Box>
      </List>
    </Drawer>
  );
};

export default Navbar;