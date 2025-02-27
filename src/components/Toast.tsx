import { motion, AnimatePresence } from 'motion/react';
import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createPortal } from 'react-dom';
import { FiX, FiInfo, FiCheckCircle, FiAlertTriangle } from 'react-icons/fi';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

let toastContainer: HTMLDivElement | null = null;
const listeners = new Set<() => void>();
const toasts = new Map<string, ToastItem>();

function createContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = '__toast_container__';
    document.body.appendChild(toastContainer);
  }

  return toastContainer;
}

function notify() {
  console.log('notify: ', listeners)
  listeners.forEach((listener) => listener());
}

const Toast = {
  show: (message: string, type: ToastType = 'info', duration = 3000) => {
    const id = Math.random().toString(36).slice(2);

    toasts.set(id, {
      id,
      message,
      type,
      duration,
    });

    createContainer();

    notify();

    if (duration > 0) {
      setTimeout(() => {
        toasts.delete(id);
        notify();
      }, duration);
    }
  },
};

const ToastItem = ({ item }: { item: ToastItem }) => {
  // 配置不同状态的颜色和图标
  const typeConfig = {
    success: { color: 'bg-green-400', icon: <FiCheckCircle /> },
    error: { color: 'bg-red-400', icon: <FiAlertTriangle /> },
    warning: { color: 'bg-yellow-500', icon: <FiAlertTriangle /> },
    info: { color: 'bg-blue-500', icon: <FiInfo /> },
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
          toasts.delete(item.id);
          notify();
        }}
        className="ml-4 hover:bg-white/10 rounded-full p-1 transition-colors"
      >
        <FiX className="text-lg" />
      </button>
    </motion.div>
  );
};

const ToastRenderer = () => {
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const update = () => {
      setItems(Array.from(toasts.values()));

      if (toasts.size === 0 && toastContainer) {
        setTimeout(() => {
          if (toasts.size === 0 && toastContainer) {
            document.body.removeChild(toastContainer);
            toastContainer = null;
          }
        }, 1000);
      }
    };

    listeners.add(update);
    return () => {
      listeners.delete(update);
    };
  }, []);

  if (!toastContainer) return null;

  return createPortal(
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-full max-w-screen-sm z-50">
      <AnimatePresence>
        {items.map((item) => (
          <ToastItem key={item.id} item={item} />
        ))}
      </AnimatePresence>
    </div>,
    toastContainer
  );
};

if (typeof document !== 'undefined') {
  const render = () => {
    if (toastContainer && !(toastContainer as any)._rendered) {
      (toastContainer as any)._rendered = true;
      createRoot(toastContainer).render(<ToastRenderer />);
    }
  };

  Toast.show = new Proxy(Toast.show, {
    apply(target, thisArg, args) {

      console.log('Toast.show: ', toastContainer)
      render();
      return target.apply(thisArg, args as any);
    },
  });
}

export default Toast;