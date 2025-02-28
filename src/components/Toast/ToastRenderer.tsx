import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FiX, FiInfo, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';
import { IToastItem } from './type';
import { toastGlobal } from './utils';

const ToastItem = ({ item }: { item: IToastItem }) => {
  // 配置不同状态的颜色和图标
  const typeConfig = {
    success: { color: 'bg-green-400', icon: <FiCheckCircle /> },
    error: { color: 'bg-red-400', icon: <FiAlertTriangle /> },
    warning: { color: 'bg-yellow-400', icon: <FiAlertTriangle /> },
    info: { color: 'bg-blue-400', icon: <FiInfo /> },
  }[item.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: 50 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      className={`${typeConfig.color} text-white rounded-lg p-4 shadow-lg max-w-md mx-4 mb-2 flex items-center`}
      role="alert"
    >
      <span className="text-xl mr-2">{typeConfig.icon}</span>
      <span className="flex-1">{item.message}</span>
      <button
        onClick={() => {
          toastGlobal.removeToast(item.id);
        }}
        className="ml-4 hover:bg-white/10 rounded-full p-1 transition-colors"
      >
        <FiX className="text-lg" />
      </button>
    </motion.div>
  );
};

const ToastRenderer = () => {
  const [items, setItems] = useState<IToastItem[]>([]);
  const { toasts, listeners, toastContainer, clearRootAndContainer } =
    toastGlobal;

  useEffect(() => {
    const update = () => {
      setItems(Array.from(toasts.values()));
      if (toasts.size === 0 && toastContainer) {
        setTimeout(() => {
          if (toasts.size === 0 && toastContainer) {
            clearRootAndContainer();
          }
        }, 1000);
      }
    };
    // 立即执行首次更新
    update();
    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  if (!toastContainer) return null;

  return createPortal(
    <div className="flex justify-center fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-screen-sm z-50">
      <AnimatePresence>
        {items.map((item) => (
          <ToastItem key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </div>,
    toastContainer
  );
};

export default ToastRenderer;
