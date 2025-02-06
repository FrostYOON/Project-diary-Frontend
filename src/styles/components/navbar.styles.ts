import { SxProps, Theme } from '@mui/material';

export const drawerStyle: SxProps = {
  width: 240,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 240,
    boxSizing: 'border-box',
    backgroundColor: '#D4A373',
    borderRight: 'none'
  }
};

export const miniDrawerStyle: SxProps = {
  width: 65,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 65,
    boxSizing: 'border-box',
    backgroundColor: '#D4A373',
    borderRight: 'none'
  }
};

export const logoStyle = (open: boolean): SxProps => ({
  width: open ? 150 : 24,
  height: 'auto',
  objectFit: 'contain',
  transition: 'width 0.2s',
  display: 'block',
  margin: '0 auto'
});

export const listItemStyle: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  color: '#333',
  padding: '6px 16px',
  '&:hover': {
    backgroundColor: '#FCDEC0',
    color: '#333'
  },
  '& .MuiListItemIcon-root': {
    minWidth: '40px'
  }
};

export const selectedListItemStyle: SxProps<Theme> = {
  backgroundColor: '#F4A261',
  color: 'white',
  '&:hover': {
    backgroundColor: '#F4A261'
  }
};

export const listItemIconStyle: SxProps = {
  minWidth: 0,
  mr: 1,
  justifyContent: 'center'
};

export const listItemTextStyle = (open: boolean): SxProps => ({
  opacity: open ? 1 : 0,
  display: open ? 'block' : 'none'
});

export const navListStyle: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  padding: 0,
  position: 'relative'
};

export const logoSectionStyle: SxProps<Theme> = {
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
  marginBottom: '16px'
};

export const logoItemStyle: SxProps<Theme> = {
  display: 'flex',
  justifyContent: 'center',
  padding: '16px 0',
  '&:hover': {
    backgroundColor: 'transparent'
  }
};

export const mainMenuSectionStyle: SxProps<Theme> = {
  padding: '8px 0',
  borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
};

export const bottomListStyle: SxProps<Theme> = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#D4A373',
  padding: '16px 0',
  '& .MuiListItemButton-root': {
    padding: '6px 16px',
    '&:hover': {
      backgroundColor: '#FCDEC0',
      color: '#333'
    }
  }
};

export const navItemContainerStyle: SxProps = {
  display: 'flex',
  justifyContent: 'center',
  '& .MuiListItem-root': {
    justifyContent: 'center',
    px: 0,
  },
  '& .MuiListItemIcon-root': {
    minWidth: 'auto',
    justifyContent: 'center'
  }
};