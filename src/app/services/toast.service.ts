import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: number;
  type: ToastType;
  title: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  toasts = signal<Toast[]>([]);
  private counter = 0;

  success(message: string, title: string = 'Success') {
    this.addToast('success', title, message);
  }

  error(message: string, title: string = 'Error') {
    this.addToast('error', title, message);
  }

  warning(message: string, title: string = 'Warning') {
    this.addToast('warning', title, message);
  }

  info(message: string, title: string = 'Info') {
    this.addToast('info', title, message);
  }

  private addToast(type: ToastType, title: string, message: string) {
    const id = this.counter++;
    const newToast: Toast = { id, type, title, message };
    
    this.toasts.update(all => {
      const updated = [newToast, ...all];
      return updated.slice(0, 3); // Max 3 toasts
    });

    setTimeout(() => {
      this.remove(id);
    }, 3000);
  }

  remove(id: number) {
    this.toasts.update(all => all.filter(t => t.id !== id));
  }
}
