import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, map, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    map(event => {
      if (event instanceof HttpResponse) {
        const body = event.body as any;
        // OMDB API returns 200 even for some errors, with a body like { Response: "False", Error: "..." }
        if (body && body.Response === 'False') {
          throw new HttpErrorResponse({
            error: { message: body.Error },
            status: 200, // It was technically 200, but we want to treat it as an error
            statusText: 'Logic Error',
            url: event.url || undefined
          });
        }
      }
      return event;
    }),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred!';

      if (error.statusText === 'Logic Error') {
        errorMessage = error.error.message || 'Data not found';
      } else if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        if (error.status === 0) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else if (error.status === 401) {
          errorMessage = 'Unauthorized access. Please check your API key.';
        } else if (error.status === 404) {
          errorMessage = 'The requested resource was not found.';
        } else {
          errorMessage = error.message || `Error Code: ${error.status}`;
        }
      }

      toastService.error(errorMessage, 'System Error');
      return throwError(() => new Error(errorMessage));
    })
  );
};
