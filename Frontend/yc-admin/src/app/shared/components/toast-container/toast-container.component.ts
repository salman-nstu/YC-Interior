import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      <div *ngFor="let toast of toasts" class="toast toast-{{toast.type}}" (click)="toastService.remove(toast.id)">
        <span class="toast-icon">{{icons[toast.type]}}</span>
        <span class="toast-msg">{{toast.message}}</span>
        <button class="toast-close">✕</button>
      </div>
    </div>
  `,
  styles: [`
    .toast-container { position: fixed; top: 80px; right: 24px; z-index: 9990; display: flex; flex-direction: column; gap: 10px; }
    .toast {
      display: flex; align-items: center; gap: 12px;
      padding: 14px 18px; border-radius: 10px;
      min-width: 280px; max-width: 400px;
      box-shadow: var(--shadow-md);
      cursor: pointer;
      animation: slideIn 0.3s ease;
      font-size: 13px; font-weight: 500;
    }
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .toast-success { background: #e9f7ef; color: #1e8449; border-left: 4px solid #1e8449; }
    .toast-error   { background: #fdedec; color: #c0392b; border-left: 4px solid #c0392b; }
    .toast-warning { background: #fef5e7; color: #d4800a; border-left: 4px solid #d4800a; }
    .toast-info    { background: #ebf5fb; color: #1a6aa0; border-left: 4px solid #1a6aa0; }
    .toast-msg { flex: 1; }
    .toast-close { background: none; border: none; cursor: pointer; font-size: 13px; opacity: 0.6; padding: 0 4px; }
    .toast-icon { font-size: 18px; flex-shrink: 0; }
  `]
})
export class ToastContainerComponent implements OnInit {
  toasts: Toast[] = [];
  icons: Record<string, string> = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };

  constructor(public toastService: ToastService) {}

  ngOnInit() {
    this.toastService.toasts.subscribe(t => this.toasts = t);
  }
}
