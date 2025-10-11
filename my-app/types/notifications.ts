export const NOTIFICATION_TYPES = {
  FRIEND_REQUEST: "friend_request",
  GENERAL: "general",
} as const;

export type NotificationType = typeof NOTIFICATION_TYPES[keyof typeof NOTIFICATION_TYPES];

export type NotificationInput = {
  type: NotificationType;
  title: string;
  message?: string;
  metadata?: Record<string, unknown> | null;
};

export type Notification = NotificationInput & {
  id: string;
  createdAt: string;
};
