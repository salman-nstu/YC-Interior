import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-spinner',
  template: `
    <div class="spinner-overlay" *ngIf="loading">
      <div class="spinner-box">
        <div class="spinner"></div>
        <p class="spinner-text">Loading...</p>
      </div>
    </div>
  `,
  styles: [`
    .spinner-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(3px); }
    .spinner-box { display: flex; flex-direction: column; align-items: center; gap: 16px; }
    .spinner { width: 48px; height: 48px; border: 4px solid rgba(255,255,255,0.25); border-top-color: #A8C090; border-radius: 50%; animation: spin 0.7s linear infinite; }
    .spinner-text { color: white; font-size: 14px; font-weight: 500; }
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class SpinnerComponent implements OnInit {
  loading = false;
  constructor(private loadingService: LoadingService) {}
  ngOnInit() { this.loadingService.loading.subscribe(l => this.loading = l); }
}
