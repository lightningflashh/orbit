import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderLayoutComponent } from './shared/header-layout/header-layout';
import { FooterLayoutComponent } from './shared/footer-layout/footer-layout';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderLayoutComponent, FooterLayoutComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('orbit');
}
