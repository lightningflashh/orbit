import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authReq = req.clone({
    withCredentials: true // Dòng này cực kỳ quan trọng để trình duyệt gửi Cookie kèm theo
  });
  return next(authReq);
};