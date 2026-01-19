import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of, switchMap } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;
  private router = inject(Router);

  // Quản lý trạng thái User bằng Signal
  currentUser = signal<any>(null);

  constructor() {
    // Khi khởi tạo service, kiểm tra xem có "vết" đăng nhập cũ không
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  register(registrationData: any) {
    return this.http.post(`${this.apiUrl}/register`, registrationData);
  }

  activateAccount(key: string) {
    return this.http.get(`${this.apiUrl}/activate`, {
      params: { key: key }
    });
  }

  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/authenticate`, credentials, {
      withCredentials: true
    }).pipe(
      tap(() => {
        const userStatus = { loggedIn: true, lastLogin: new Date().getTime() };
        localStorage.setItem('user', JSON.stringify(userStatus));
        this.currentUser.set(userStatus);
      }),
      switchMap(() => this.checkIdentity()) // Lấy thông tin user thực từ Server sau khi login
    );
  }

  // Kiểm tra trạng thái thực tế từ Server (Nên gọi khi App khởi chạy)
  checkIdentity() {
    return this.http.get(`${this.apiUrl}/account`, { withCredentials: true })
      .pipe(
        tap((user) => this.currentUser.set(user)), // Nếu 200 OK, set user thật từ BE
        catchError(() => {
          this.logoutLocal(); // Nếu 401/error, xóa trạng thái local
          return of(null);
        })
      );
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  private refreshDoneSubject = new BehaviorSubject<boolean>(false);
  refreshDone$ = this.refreshDoneSubject.asObservable();

  refreshToken() {
    this.refreshDoneSubject.next(false);

    return this.http.post(`${this.apiUrl}/refresh`, {}).pipe(
      tap(() => this.refreshDoneSubject.next(true))
    );
  }

  logoutLocal() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}).pipe(
      tap(() => {
        this.logoutLocal();
        this.router.navigate(['/login']);
      })
    );
  }

}