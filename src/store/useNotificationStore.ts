import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Notification, UserRole } from '@/types';
import { mockNotifications } from '@/mock';

interface NotificationState {
  notifications: Notification[];
  
  getNotificationsByUser: (userId: string, userRole: UserRole) => Notification[];
  getUnreadCount: (userId: string, userRole: UserRole) => number;
  markAsRead: (id: string) => void;
  markAllAsRead: (userId: string, userRole: UserRole) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set, get) => ({
      notifications: mockNotifications,
      
      getNotificationsByUser: (userId: string, userRole: UserRole) =>
        get().notifications
          .filter(n => n.userId === userId && n.userRole === userRole)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
      
      getUnreadCount: (userId: string, userRole: UserRole) =>
        get().notifications.filter(
          n => n.userId === userId && n.userRole === userRole && !n.read
        ).length,
      
      markAsRead: (id: string) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
          )
        }));
      },
      
      markAllAsRead: (userId: string, userRole: UserRole) => {
        set(state => ({
          notifications: state.notifications.map(n =>
            n.userId === userId && n.userRole === userRole ? { ...n, read: true } : n
          )
        }));
      },
      
      addNotification: (data) => {
        const newNotification: Notification = {
          id: `n${Date.now()}`,
          ...data,
          read: false,
          createdAt: new Date().toISOString()
        };
        set(state => ({
          notifications: [newNotification, ...state.notifications]
        }));
      },
    }),
    {
      name: 'notification-storage',
    }
  )
);
