import React from 'react';
import { motion } from 'framer-motion';
import {
  FilmIcon,
  ArrowDownTrayIcon,
  ServerIcon,
  CircleStackIcon,
  GlobeAltIcon,
  CubeIcon
} from '@heroicons/react/24/outline';
import { SystemLink } from '../types';

interface SystemLinkCardProps {
  link: SystemLink;
}

const iconMap = {
  film: FilmIcon,
  download: ArrowDownTrayIcon,
  server: ServerIcon,
  storage: CircleStackIcon,
  network: GlobeAltIcon,
  other: CubeIcon
};

const categoryColors = {
  media: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  download: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  monitoring: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
  storage: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  network: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300'
};

const statusColors = {
  online: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
  offline: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
  unknown: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
};

const SystemLinkCard: React.FC<SystemLinkCardProps> = ({ link }) => {
  const IconComponent = iconMap[link.icon as keyof typeof iconMap] || CubeIcon;

  const handleClick = () => {
    window.open(link.url, '_blank');
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      className="glass-card p-4 cursor-pointer card-hover"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${categoryColors[link.category]}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {link.name}
            </h4>
            {link.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {link.description}
              </p>
            )}
          </div>
        </div>
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[link.status]}`}>
          {link.status === 'online' ? '在线' : link.status === 'offline' ? '离线' : '未知'}
        </span>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
        <span>{link.url}</span>
        {link.port && (
          <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
            :{link.port}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default SystemLinkCard;