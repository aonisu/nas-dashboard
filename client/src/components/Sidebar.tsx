import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HomeIcon,
  LinkIcon,
  CpuChipIcon,
  CubeIcon,
  Cog6ToothIcon,
  Bars3Icon,
  ServerIcon
} from '@heroicons/react/24/outline';
import { useStore } from '../store/useStore';

const navigation = [
  { name: '仪表板', href: '/', icon: HomeIcon },
  { name: '系统链接', href: '/links', icon: LinkIcon },
  { name: '系统信息', href: '/system', icon: CpuChipIcon },
  { name: 'Docker管理', href: '/docker', icon: CubeIcon },
  { name: '设置', href: '/settings', icon: Cog6ToothIcon },
];

const Sidebar: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useStore();

  return (
    <>
      <motion.div
        initial={false}
        animate={{ width: sidebarOpen ? 256 : 64 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="fixed left-0 top-0 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-30"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center h-16 px-4 border-b border-gray-200 dark:border-gray-700">
            <motion.div
              animate={{ scale: sidebarOpen ? 1 : 0.8 }}
              className="flex items-center"
            >
              <ServerIcon className="h-8 w-8 text-primary-600" />
              {sidebarOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                  className="ml-3 text-xl font-bold text-gray-900 dark:text-white"
                >
                  NAS 管理
                </motion.span>
              )}
            </motion.div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-primary-100 dark:bg-primary-900 text-primary-900 dark:text-primary-100'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`
                }
              >
                <item.icon className="mr-3 h-6 w-6 flex-shrink-0" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    {item.name}
                  </motion.span>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Toggle Button */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="w-full flex items-center justify-center p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default Sidebar;