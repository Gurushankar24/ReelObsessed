import { ApplicationConfig, provideBrowserGlobalErrorListeners, ErrorHandler } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { errorInterceptor } from './interceptors/error.interceptor';
import { GlobalErrorHandler } from './services/error-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes), 
    provideAnimations(),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor])),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ]
};
