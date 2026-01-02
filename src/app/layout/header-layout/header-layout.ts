import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../features/auth/auth.service';
import { ToastService } from '../../shared/toast/toast.service';

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
  onLogout() {
    this.authService.logout().subscribe({
      next: () => {
        this.toast.show('You have been logged out.', 'success');
      }
    });
  }
}