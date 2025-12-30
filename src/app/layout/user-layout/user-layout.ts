import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HeaderLayoutComponent } from '../header-layout/header-layout';
import { FooterLayoutComponent } from '../footer-layout/footer-layout';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,    // Bắt buộc phải có để hiển thị con
    HeaderLayoutComponent,
    FooterLayoutComponent
  ],
  templateUrl: './user-layout.html',
})
export class UserLayoutComponent {
}