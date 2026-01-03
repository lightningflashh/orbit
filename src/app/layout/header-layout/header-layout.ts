import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';
import { ToastService } from '../../shared/toast/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'header-layout',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header-layout.html',
  styleUrls: ['./header-layout.css']
})
export class HeaderLayoutComponent {
  authService = inject(AuthService);
  private toast = inject(ToastService);
  private router = inject(Router);
  isProfileOpen = false;

  ngOnInit() {
    if (localStorage.getItem('token')) {
      this.authService.checkIdentity();
    }
  }

  toggleDropdown() {
    this.isProfileOpen = !this.isProfileOpen;
  }

  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.toast.show('You have been logged out.', 'success');
      }
    });
  }
}