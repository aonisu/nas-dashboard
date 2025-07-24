import React from 'react';
import { motion } from 'framer-motion';
import {
  CpuChipIcon,
  CircleStackIcon,
  ServerIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SystemInfo: React.FC = () => {
  // Mock data for demonstration
  const systemData = {
    hostname: 'NAS-Home',
    platform: 'Linux',
    arch: 'x64',
    uptime: 1234567,
    cpuUsage: 45,
    memoryUsage: 62,
    totalMemory: 16,
    usedMemory: 9.9
  };

  const performanceData = [
    { time: '00:00', cpu: 20, memory: 45 },
    { time: '04:00', cpu: 35, memory: 50 },
    { time: '08:00', cpu: 55, memory: 65 },
    { time: '12:00', cpu: 45, memory: 60 },
    { time: '16:00', cpu: 65, memory: 70 },
    { time: '20:00', cpu: 40, memory: 55 },
    { time: '24:00', cpu: 25, memory: 48 }
  ];

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}天 ${hours}小时 ${minutes}分钟`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          系统信息
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          查看系统硬件信息和性能监控
        </p>
      </motion.div>

      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                主机名
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
                {systemData.hostname}
              </p>
            </div>
            <ServerIcon className="h-8 w-8 text-blue-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                运行时间
              </p>
              <p className="text-lg font-semibold text-gray-900 dark:text-white mt-1">
                {formatUptime(systemData.uptime)}
              </p>
            </div>
            <ClockIcon className="h-8 w-8 text-green-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                CPU 使用率
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
                {systemData.cpuUsage}%
              </p>
            </div>
            <CpuChipIcon className="h-8 w-8 text-orange-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass-card p-6"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                内存使用
              </p>
              <p className="text-xl font-semibold text-gray-900 dark:text-white mt-1">
                {systemData.usedMemory}GB / {systemData.totalMemory}GB
              </p>
            </div>
            <CircleStackIcon className="h-8 w-8 text-purple-600" />
          </div>
        </motion.div>
      </div>

      {/* Performance Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          24小时性能监控
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="time" stroke="#6B7280" />
              <YAxis stroke="#6B7280" />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#F9FAFB'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="cpu" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="CPU 使用率 (%)"
              />
              <Line 
                type="monotone" 
                dataKey="memory" 
                stroke="#8B5CF6" 
                strokeWidth={2}
                name="内存使用率 (%)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* System Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          系统详情
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">操作系统</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {systemData.platform}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">架构</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {systemData.arch}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">主机名</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {systemData.hostname}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">总内存</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {systemData.totalMemory}GB
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">已用内存</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {systemData.usedMemory}GB
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
              <span className="text-gray-600 dark:text-gray-400">空闲内存</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {(systemData.totalMemory - systemData.usedMemory).toFixed(1)}GB
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SystemInfo;