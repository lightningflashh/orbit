import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './register.html',
})

export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  registerData = {
    login: '',
    email: '',
    password: '',
    confirmPassword: '',
    langKey: 'en'
  };

  isEmailValid(email: string): boolean {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return emailPattern.test(email);
  }

  showPassword = false;
  showConfirmPassword = false;

  onRegister() {
    // 1. Kiểm tra lại lần cuối trước khi gọi Service
    if (this.registerData.password !== this.registerData.confirmPassword) {
      this.toast.show('Mật khẩu xác nhận không khớp!', 'error');
      return;
    }

    if (!this.isEmailValid(this.registerData.email)) {
      this.toast.show('Email không đúng định dạng!', 'error');
      return;
    }

    // 2. Tạo một object mới CHỈ CHỨA các trường BE cần
    const { confirmPassword, ...dataToSend } = this.registerData;

    this.authService.register(dataToSend).subscribe({
      next: () => {
        this.toast.show('Mission Started! Please sign in.', 'success');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.toast.show('Mission Failed: ' + (err.error?.message || 'Error'), 'error');
      }
    });
  }
}