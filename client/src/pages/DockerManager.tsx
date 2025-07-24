import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CubeIcon,
  PlayIcon,
  StopIcon,
  TrashIcon,
  EyeIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { DockerContainer } from '../types';

const DockerManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Mock Docker containers data
  const containers: DockerContainer[] = [
    {
      id: 'c1a2b3c4d5e6',
      name: 'plex',
      image: 'plexinc/pms-docker:latest',
      status: 'Up 2 days',
      state: 'running',
      ports: ['32400:32400/tcp'],
      created: '2024-01-15T10:30:00Z'
    },
    {
      id: 'f7g8h9i0j1k2',
      name: 'qbittorrent',
      image: 'lscr.io/linuxserver/qbittorrent:latest',
      status: 'Up 5 hours',
      state: 'running',
      ports: ['8080:8080/tcp', '6881:6881/tcp'],
      created: '2024-01-10T14:20:00Z'
    },
    {
      id: 'l3m4n5o6p7q8',
      name: 'portainer',
      image: 'portainer/portainer-ce:latest',
      status: 'Exited (0) 1 hour ago',
      state: 'exited',
      ports: ['9000:9000/tcp'],
      created: '2024-01-08T09:15:00Z'
    },
    {
      id: 'r9s0t1u2v3w4',
      name: 'jellyfin',
      image: 'jellyfin/jellyfin:latest',
      status: 'Up 12 hours',
      state: 'running',
      ports: ['8096:8096/tcp'],
      created: '2024-01-12T16:45:00Z'
    }
  ];

  const filteredContainers = containers.filter(container => {
    const matchesSearch = container.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         container.image.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || container.state === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (state: string) => {
    switch (state) {
      case 'running':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'exited':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleContainerAction = (containerId: string, action: string) => {
    console.log(`${action} container ${containerId}`);
    // TODO: Implement Docker API calls
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Docker 容器管理
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              管理和监控您的 Docker 容器
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              运行中: <span className="font-semibold text-green-600">
                {containers.filter(c => c.state === 'running').length}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              已停止: <span className="font-semibold text-red-600">
                {containers.filter(c => c.state === 'exited').length}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="搜索容器..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 input-field"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="input-field"
          >
            <option value="all">全部状态</option>
            <option value="running">运行中</option>
            <option value="exited">已停止</option>
            <option value="paused">已暂停</option>
          </select>
        </div>
      </motion.div>

      {/* Containers List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  容器
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  镜像
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  状态
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  端口
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredContainers.map((container, index) => (
                <motion.tr
                  key={container.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <CubeIcon className="h-8 w-8 text-blue-600 mr-3" />
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {container.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                          {container.id.substring(0, 12)}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {container.image}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(container.state)}`}>
                      {container.state === 'running' ? '运行中' : 
                       container.state === 'exited' ? '已停止' : 
                       container.state === 'paused' ? '已暂停' : container.state}
                    </span>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {container.status}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                      {container.ports.join(', ')}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      {container.state === 'running' ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleContainerAction(container.id, 'stop')}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                          title="停止容器"
                        >
                          <StopIcon className="h-4 w-4" />
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleContainerAction(container.id, 'start')}
                          className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                          title="启动容器"
                        >
                          <PlayIcon className="h-4 w-4" />
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleContainerAction(container.id, 'logs')}
                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="查看日志"
                      >
                        <EyeIcon className="h-4 w-4" />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleContainerAction(container.id, 'remove')}
                        className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        title="删除容器"
                      >
                        <TrashIcon className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default DockerManager;