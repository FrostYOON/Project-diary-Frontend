import { ReactNode } from 'react';

export interface MenuItem {
  type?: 'logo';
  text?: string;
  icon: ReactNode;
  path?: string;
  onClick?: () => void;
}

export interface StyledListItemProps {
  active?: number;
}

export interface StyledDrawerProps {
  open?: boolean;
} 