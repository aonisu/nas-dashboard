import React from 'react';
import { motion } from 'framer-motion';

interface StatusCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<any>;
  color: string;
  trend: string;
}

const StatusCard: React.FC<StatusCardProps> = ({
  title,
  value,
  icon: Icon,
  color,
  trend
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="glass-card p-6"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {title}
          </p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white mt-1">
            {value}
          </p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-1">
            {trend}
          </p>
        </div>
        <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${color}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </motion.div>
  );
};

export default StatusCard;