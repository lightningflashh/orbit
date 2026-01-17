import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError, filter, take } from 'rxjs';
import { AuthService } from './auth.service';

let isRefreshing = false;

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {

      if (
        error.status === 401 &&
        !req.url.endsWith('/authenticate') &&
        !req.url.endsWith('/refresh') &&
        !req.url.endsWith('/logout')
      ) {

        if (!isRefreshing) {
          isRefreshing = true;

          return authService.refreshToken().pipe(
            switchMap(() => {
              isRefreshing = false;
              return next(authReq);
            }),
            catchError(err => {
              isRefreshing = false;
              authService.logout();
              return throwError(() => err);
            })
          );
        }

        // nếu đang refresh → chờ refresh xong rồi retry
        return authService.refreshDone$.pipe(
          filter(done => done === true),
          take(1),
          switchMap(() => next(authReq))
        );
      }

      return throwError(() => error);
    })
  );
};
