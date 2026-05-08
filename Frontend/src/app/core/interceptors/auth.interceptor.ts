import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const injector = inject(Injector);
  let token: string | null = null;
  
  // Try to get token from AuthService, but don't fail if it's not available
  try {
    const auth = injector.get(AuthService, null);
    if (auth) {
      token = auth.getToken();
    }
  } catch (e) {
    // Silently fail - this is expected during initialization
  }

  // Clone request with auth header and security headers
  const cloned = token
    ? req.clone({ 
        setHeaders: { 
          Authorization: `Bearer ${token}`,
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    : req.clone({
        setHeaders: {
          'X-Requested-With': 'XMLHttpRequest',
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      });

  return next(cloned).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === 401 || err.status === 403) {
        try {
          const auth = injector.get(AuthService, null);
          if (auth) {
            if (err.status === 401) {
              console.warn('Unauthorized access - logging out');
              auth.logout();
            } else if (err.status === 403) {
              console.warn('Forbidden access');
            }
          }
        } catch (e) {
          // Silently fail
        }
      }
      return throwError(() => err);
    })
  );
};
