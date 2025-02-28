import { createRoot } from 'react-dom/client';
import { IToastItem } from './type';

class ToastGlobal {
  // 单例实例
  private static instance: ToastGlobal;
  
  // 全局状态
  private _toastContainer: HTMLDivElement | null = null;
  private _listeners = new Set<() => void>();
  private _reactRoot: ReturnType<typeof createRoot> | null = null;
  private _toasts = new Map<string, IToastItem>();

  private constructor() {} // 阻止外部实例化

  // 获取单例
  public static get shared(): ToastGlobal {
    if (!ToastGlobal.instance) {
      ToastGlobal.instance = new ToastGlobal();
    }
    return ToastGlobal.instance;
  }

  get toasts() {
    return this._toasts;
  }

  get listeners() {
    return this._listeners;
  }

  get reactRoot() {
    return this._reactRoot;
  }

  get toastContainer() {
    return this._toastContainer;
  }

  addToast(item: IToastItem) {
    this._toasts.set(item.id, item);
    this.notify();
  }

  removeToast(id: string) {
    this._toasts.delete(id);
    this.notify();
  }

  // 方法实现
  notify() {
    this._listeners.forEach(listener => listener());
  }

  createContainer() {
    if (!this._toastContainer) {
      this._toastContainer = document.createElement('div');
      this._toastContainer.id = '__toast_container__';
      document.body.appendChild(this._toastContainer);
    }
    return this._toastContainer;
  }

  createReactRoot() {
    this.createContainer();
    this._reactRoot = createRoot(this._toastContainer!);
    return this._reactRoot;
  }

  clearRootAndContainer() {
    if (this._toastContainer) {
      document.body.removeChild(this._toastContainer);
    }
    this._reactRoot = null;
    this._toastContainer = null;
  }
}

// 导出单例实例
export const toastGlobal = ToastGlobal.shared;
