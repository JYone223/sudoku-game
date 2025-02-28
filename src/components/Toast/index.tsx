import { lazy, Suspense } from 'react';
import type { ToastType } from './type';
import { toastGlobal } from './utils';

const ToastRenderer = lazy(() => import('./ToastRenderer'));

function ensureInitialized() {
  if (!toastGlobal.reactRoot) {
    const reactRoot = toastGlobal.createReactRoot();
    reactRoot.render(
      <Suspense>
        <ToastRenderer />
      </Suspense>
    );
  }
}

const Toast = {
  show: (message: string, type: ToastType = 'info', duration = 3000) => {
    ensureInitialized();
    const id = Math.random().toString(36).slice(2);
    toastGlobal.addToast({
      id,
      message,
      type,
      duration,
    });

    if (duration > 0) {
      setTimeout(() => {
        toastGlobal.removeToast(id);
      }, duration);
    }
  },
};

export default Toast;
