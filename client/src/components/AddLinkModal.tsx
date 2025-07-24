import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useStore } from '../store/useStore';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddLinkModal: React.FC<AddLinkModalProps> = ({ isOpen, onClose }) => {
  const { addSystemLink } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    icon: 'server',
    description: '',
    category: 'other' as const,
    port: ''
  });

  const categories = [
    { value: 'media', label: '媒体' },
    { value: 'download', label: '下载' },
    { value: 'monitoring', label: '监控' },
    { value: 'storage', label: '存储' },
    { value: 'network', label: '网络' },
    { value: 'other', label: '其他' }
  ];

  const icons = [
    { value: 'server', label: '服务器' },
    { value: 'film', label: '媒体' },
    { value: 'download', label: '下载' },
    { value: 'storage', label: '存储' },
    { value: 'network', label: '网络' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    addSystemLink({
      name: formData.name,
      url: formData.url,
      icon: formData.icon,
      description: formData.description,
      category: formData.category,
      status: 'unknown',
      port: formData.port ? parseInt(formData.port) : undefined
    });

    setFormData({
      name: '',
      url: '',
      icon: 'server',
      description: '',
      category: 'other',
      port: ''
    });
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-md"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  添加系统链接
                </h3>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    系统名称
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="例如: Plex Media Server"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    访问地址
                  </label>
                  <input
                    type="url"
                    name="url"
                    value={formData.url}
                    onChange={handleChange}
                    required
                    placeholder="http://localhost:32400"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      图标
                    </label>
                    <select
                      name="icon"
                      value={formData.icon}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {icons.map(icon => (
                        <option key={icon.value} value={icon.value}>
                          {icon.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      分类
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="input-field"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    端口号 (可选)
                  </label>
                  <input
                    type="number"
                    name="port"
                    value={formData.port}
                    onChange={handleChange}
                    placeholder="32400"
                    className="input-field"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    描述 (可选)
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    placeholder="简短描述这个系统的用途..."
                    className="input-field resize-none"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="btn-secondary"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="btn-primary"
                  >
                    添加链接
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AddLinkModal;