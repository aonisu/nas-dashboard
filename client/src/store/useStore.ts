import { create } from 'zustand';
import { SystemLink, SystemInfo, Notification } from '../types';

interface AppState {
  // System Links
  systemLinks: SystemLink[];
  addSystemLink: (link: Omit<SystemLink, 'id'>) => void;
  updateSystemLink: (id: string, updates: Partial<SystemLink>) => void;
  removeSystemLink: (id: string) => void;
  
  // System Info
  systemInfo: SystemInfo | null;
  setSystemInfo: (info: SystemInfo) => void;
  
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp'>) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  
  // UI State
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // System Links
  systemLinks: [
    {
      id: '1',
      name: 'Plex Media Server',
      url: 'http://localhost:32400',
      icon: 'film',
      description: '媒体服务器',
      category: 'media',
      status: 'online',
      port: 32400
    },
    {
      id: '2',
      name: 'qBittorrent',
      url: 'http://localhost:8080',
      icon: 'download',
      description: 'BT下载工具',
      category: 'download',
      status: 'online',
      port: 8080
    },
    {
      id: '3',
      name: 'Portainer',
      url: 'http://localhost:9000',
      icon: 'server',
      description: 'Docker管理',
      category: 'monitoring',
      status: 'online',
      port: 9000
    }
  ],
  
  addSystemLink: (link) => {
    const newLink: SystemLink = {
      ...link,
      id: Date.now().toString(),
    };
    set((state) => ({
      systemLinks: [...state.systemLinks, newLink]
    }));
  },
  
  updateSystemLink: (id, updates) => {
    set((state) => ({
      systemLinks: state.systemLinks.map(link =>
        link.id === id ? { ...link, ...updates } : link
      )
    }));
  },
  
  removeSystemLink: (id) => {
    set((state) => ({
      systemLinks: state.systemLinks.filter(link => link.id !== id)
    }));
  },
  
  // System Info
  systemInfo: null,
  setSystemInfo: (info) => set({ systemInfo: info }),
  
  // Theme
  darkMode: localStorage.getItem('darkMode') === 'true',
  toggleDarkMode: () => {
    const newDarkMode = !get().darkMode;
    localStorage.setItem('darkMode', newDarkMode.toString());
    document.documentElement.classList.toggle('dark', newDarkMode);
    set({ darkMode: newDarkMode });
  },
  
  // Notifications
  notifications: [],
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false
    };
    set((state) => ({
      notifications: [newNotification, ...state.notifications]
    }));
  },
  
  markNotificationRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    }));
  },
  
  clearNotifications: () => set({ notifications: [] }),
  
  // UI State
  sidebarOpen: true,
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));