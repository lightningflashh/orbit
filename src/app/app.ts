import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { OnInit, inject } from '@angular/core';
import { AuthService } from './features/auth/auth.service';
import { ToastComponent } from './shared/toast/toast';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('orbit');

  authService = inject(AuthService);
  ngOnInit() {
    // Mỗi khi F5 hoặc mở web, hỏi BE xem Cookie còn sống không
    this.authService.checkIdentity().subscribe();
  }
}
