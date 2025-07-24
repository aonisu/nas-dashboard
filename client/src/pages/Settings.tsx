import React from 'react';
import { motion } from 'framer-motion';
import {
  Cog6ToothIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { useStore } from '../store/useStore';

const Settings: React.FC = () => {
  const { darkMode, toggleDarkMode } = useStore();

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-6"
      >
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
          设置
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          配置您的 NAS 管理平台设置
        </p>
      </motion.div>

      {/* Theme Toggle */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-card p-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <SwatchIcon className="h-6 w-6 text-primary-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                主题模式
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                选择浅色或深色主题
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleDarkMode}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              darkMode ? 'bg-primary-600' : 'bg-gray-300'
            }`}
          >
            <motion.span
              animate={{ x: darkMode ? 20 : 2 }}
              className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform"
            />
          </motion.button>
        </div>
      </motion.div>

      {/* System Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass-card p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Cog6ToothIcon className="h-6 w-6 text-primary-600" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            系统信息
          </h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">版本</span>
            <span className="font-medium text-gray-900 dark:text-white">v1.0.0</span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700">
            <span className="text-gray-600 dark:text-gray-400">构建时间</span>
            <span className="font-medium text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-gray-600 dark:text-gray-400">作者</span>
            <span className="font-medium text-gray-900 dark:text-white">NAS Dashboard</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;