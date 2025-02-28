
export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface IToastItem {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}