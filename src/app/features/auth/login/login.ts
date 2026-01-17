import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  loginData = {
    username: '',
    password: '',
    rememberMe: false
  };

  showPassword = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: _ => {
        this.toast.show('Login successful. Welcome back Commander!', 'success');
        this.router.navigate(['']);
      },
      error: _ => {
        this.toast.show('Username or Password is incorrect. Please try again.', 'error');
      }
    });
  }
}