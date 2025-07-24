import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowPathIcon,
  TrashIcon,
  ArchiveBoxIcon,
  WifiIcon
} from '@heroicons/react/24/outline';

interface QuickActionCardProps {
  id: string;
  name: string;
  icon: string;
  action: () => void;
  color: string;
}

const iconMap = {
  'arrow-path': ArrowPathIcon,
  'trash': TrashIcon,
  'archive-box': ArchiveBoxIcon,
  'wifi': WifiIcon
};

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  name,
  icon,
  action,
  color
}) => {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || ArrowPathIcon;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={action}
      className="glass-card p-4 text-center w-full hover:shadow-lg transition-shadow duration-200"
    >
      <div className={`w-12 h-12 ${color} rounded-full flex items-center justify-center mx-auto mb-3`}>
        <IconComponent className="h-6 w-6 text-white" />
      </div>
      <span className="text-sm font-medium text-gray-900 dark:text-white">
        {name}
      </span>
    </motion.button>
  );
};

export default QuickActionCard;