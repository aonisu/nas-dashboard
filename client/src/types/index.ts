export interface SystemLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  description?: string;
  category: 'media' | 'download' | 'monitoring' | 'storage' | 'network' | 'other';
  status: 'online' | 'offline' | 'unknown';
  port?: number;
  lastChecked?: string;
}

export interface SystemInfo {
  hostname: string;
  platform: string;
  arch: string;
  uptime: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: DiskInfo[];
  networkInterfaces: NetworkInterface[];
  dockerInfo?: DockerInfo;
}

export interface DiskInfo {
  filesystem: string;
  size: number;
  used: number;
  available: number;
  mountpoint: string;
  usagePercent: number;
}

export interface NetworkInterface {
  interface: string;
  ip4: string;
  ip6?: string;
  mac: string;
  speed?: number;
}

export interface DockerInfo {
  containers: DockerContainer[];
  images: number;
  running: number;
  stopped: number;
  version: string;
}

export interface DockerContainer {
  id: string;
  name: string;
  image: string;
  status: string;
  state: string;
  ports: string[];
  created: string;
}

export interface QuickAction {
  id: string;
  name: string;
  icon: string;
  action: () => void;
  color: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}