import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class ToastComponent {
  toastService = inject(ToastService);

  getClasses(type: string): string {
    const base = 'bg-white/[0.03] ';
    if (type === 'success') return base + 'border-emerald-500/30 shadow-emerald-500/10';
    if (type === 'error') return base + 'border-red-500/30 shadow-red-500/10';
    return base + 'border-indigo-500/30 shadow-indigo-500/10';
  }

  getIconBg(type: string): string {
    if (type === 'success') return 'bg-emerald-500 text-white';
    if (type === 'error') return 'bg-red-500 text-white';
    return 'bg-indigo-500 text-white';
  }
}