import React, { createContext, useContext, useState } from 'react';

import type { Notification, NotificationInput } from '@/types/notifications';

type NotificationsContextType = {
  notifications: Notification[];
  addNotification: (notification: NotificationInput) => void;
  clearNotifications: () => void;
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (input: NotificationInput) => {
    const id = String(Date.now());
    const createdAt = new Date().toISOString();
    const normalizedMessage = input.message?.trim();

    setNotifications(prev => [
      {
        id,
        createdAt,
        type: input.type,
        title: input.title,
        message: normalizedMessage ? normalizedMessage : undefined,
        metadata: input.metadata ?? null,
      },
      ...prev,
    ]);
  };

  const clearNotifications = () => setNotifications([]);

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, clearNotifications }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
};

export default NotificationsContext;
