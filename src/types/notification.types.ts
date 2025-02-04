export type NotificationType =
  | "PROJECT_CREATED"
  | "PROJECT_DUE_SOON"
  | "PROJECT_ENDED"
  | "PROJECT_CANCELED";

export interface Notification {
  _id: string;
  title: string;
  content: string;
  type: NotificationType;
  project?: {
    _id: string;
    title: string;
  };
  recipients: string[];
  isRead: boolean;
  readBy: string[];
  createdAt: string;
} 