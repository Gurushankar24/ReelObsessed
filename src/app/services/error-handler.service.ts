import { ErrorHandler, Injectable, inject } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class GlobalErrorHandler implements ErrorHandler {
  private toastService = inject(ToastService);

  handleError(error: any): void {
    console.error('Global Error:', error);

    const message = error.message ? error.message : error.toString();
    
    // We can't use the regular flow because this might happen outside Change Detection
    // But since ToastService uses signals, it should be fine.
    // However, some UI updates might need a NgZone.run if it's very outside.
    
    // For now, let's keep it simple.
    this.toastService.error('An unexpected error occurred. Please try again later.', 'Application Error');
  }
}
