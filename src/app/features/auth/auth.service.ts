import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8099/api';

  // Quản lý trạng thái User bằng Signal
  currentUser = signal<any>(null);

  constructor() {
    // Khi khởi tạo service, kiểm tra xem có "vết" đăng nhập cũ không
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      this.currentUser.set(JSON.parse(savedUser));
    }
  }

  // Phương thức đăng nhập
  login(credentials: any) {
    return this.http.post(`${this.apiUrl}/authenticate`, credentials, {
      withCredentials: true
    }).pipe(
      tap(() => {
        // Vì BE set cookie, ta chỉ lưu trạng thái giả để UI biến đổi
        const userStatus = { loggedIn: true, lastLogin: new Date().getTime() };
        localStorage.setItem('user', JSON.stringify(userStatus));
        this.currentUser.set(userStatus);
      })
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

  logoutLocal() {
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }

  logout() {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true })
      .pipe(
        tap(() => this.logoutLocal())
      );
  }
}