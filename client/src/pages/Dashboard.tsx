import React from 'react';
import { motion } from 'framer-motion';
import {
  CpuChipIcon,
  CircleStackIcon,
  GlobeAltIcon,
  CubeIcon,
  ChartBarIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import { useStore } from '../store/useStore';
import SystemLinkCard from '../components/SystemLinkCard';
import StatusCard from '../components/StatusCard';
import QuickActionCard from '../components/QuickActionCard';

const Dashboard: React.FC = () => {
  const { systemLinks } = useStore();

  const quickActions = [
    {
      id: '1',
      name: '重启系统',
      icon: 'arrow-path',
      action: () => console.log('重启系统'),
      color: 'bg-red-500'
    },
    {
      id: '2',
      name: '清理缓存',
      icon: 'trash',
      action: () => console.log('清理缓存'),
      color: 'bg-blue-500'
    },
    {
      id: '3',
      name: '备份配置',
      icon: 'archive-box',
      action: () => console.log('备份配置'),
      color: 'bg-green-500'
    },
    {
      id: '4',
      name: '网络诊断',
      icon: 'wifi',
      action: () => console.log('网络诊断'),
      color: 'bg-purple-500'
    }
  ];

  const statusCards = [
    {
      title: 'CPU 使用率',
      value: '45%',
      icon: CpuChipIcon,
      color: 'text-blue-600',
      trend: '+2.1%'
    },
    {
      title: '内存使用',
      value: '6.2GB / 16GB',
      icon: CircleStackIcon,
      color: 'text-green-600',
      trend: '+0.5GB'
    },
    {
      title: '网络流量',
      value: '1.2GB/h',
      icon: GlobeAltIcon,
      color: 'text-purple-600',
      trend: '+15%'
    },
    {
      title: 'Docker容器',
      value: '12 运行中',
      icon: CubeIcon,
      color: 'text-orange-600',
      trend: '+1'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              欢迎回来！
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              系统运行正常，所有服务状态良好
            </p>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            <ClockIcon className="h-4 w-4" />
            <span>最后更新: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
      </motion.div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statusCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatusCard {...card} />
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <ChartBarIcon className="h-6 w-6 mr-2" />
          快速操作
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <QuickActionCard {...action} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* System Links Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="glass-card p-6"
      >
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          常用系统
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {systemLinks.slice(0, 6).map((link, index) => (
            <motion.div
              key={link.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <SystemLinkCard link={link} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;