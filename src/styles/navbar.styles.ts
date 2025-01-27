import { styled } from '@mui/material/styles';
import { Drawer, ListItem } from '@mui/material';
import { StyledListItemProps, StyledDrawerProps } from '../types/navbar.types';

export const DRAWER_WIDTH = 240;
export const COLLAPSED_WIDTH = 65;

export const StyledDrawer = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<StyledDrawerProps>(({ theme, open }) => ({
  width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  '& .MuiDrawer-paper': {
    width: open ? DRAWER_WIDTH : COLLAPSED_WIDTH,
    backgroundColor: '#D4A373',
    backdropFilter: 'blur(5px)',
    border: 'none',
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
  },
}));

export const StyledListItem = styled(ListItem)<StyledListItemProps>(({ active }) => ({
  margin: '8px',
  borderRadius: '8px',
  color: 'white',
  cursor: 'pointer',
  backgroundColor: active ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
  '&:hover': {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  '& .MuiListItemIcon-root': {
    color: 'white',
    minWidth: 40,
  },
})); 