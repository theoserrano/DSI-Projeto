import React, { createContext, useContext, useState } from 'react';

type Notification = {
  id: string;
  name: string;
};

type NotificationsContextType = {
  notifications: Notification[];
  addNotification: (name: string) => void;
  clearNotifications: () => void;
};

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export const NotificationsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (name: string) => {
    const id = String(Date.now());
    setNotifications(prev => [{ id, name }, ...prev]);
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
