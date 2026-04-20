import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule,
    MatIconModule, MatProgressSpinnerModule, MatSnackBarModule
  ],
  template: `
    <div class="login-page">
      <div class="login-card">
        <div class="login-header">
          <mat-icon class="logo-icon">architecture</mat-icon>
          <h1>YC Interior</h1>
          <p>Admin Panel</p>
        </div>

        <form [formGroup]="form" (ngSubmit)="submit()">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="admin@yc.com">
            <mat-icon matPrefix>email</mat-icon>
            <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">Invalid email</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input matInput [type]="showPass ? 'text' : 'password'" formControlName="password">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix type="button" (click)="showPass = !showPass">
              <mat-icon>{{ showPass ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
          </mat-form-field>

          <div *ngIf="error" class="error-msg">{{ error }}</div>

          <button mat-flat-button color="primary" type="submit" class="submit-btn" [disabled]="loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">Sign In</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-page {
      min-height: 100vh;
      display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, var(--matcha-dark) 0%, var(--matcha) 50%, var(--matcha-light) 100%);
    }
    .login-card {
      background: var(--surface); 
      border-radius: 16px;
      padding: 40px; 
      width: 100%; 
      max-width: 400px;
      box-shadow: var(--shadow-hover);
      border: 1px solid var(--border);
    }
    .login-header {
      text-align: center; margin-bottom: 32px;
      .logo-icon { 
        font-size: 48px; 
        width: 48px; 
        height: 48px; 
        color: var(--matcha); 
      }
      h1 { 
        font-size: 24px; 
        font-weight: 700; 
        color: var(--text); 
        margin-top: 8px; 
      }
      p { 
        color: var(--text-muted); 
        font-size: 14px; 
      }
    }
    .full-width { 
      width: 100%; 
      margin-bottom: 8px; 
    }
    .error-msg { 
      color: #c62828; 
      font-size: 13px; 
      margin-bottom: 12px; 
      padding: 8px 12px; 
      background: #ffebee; 
      border-radius: 6px; 
    }
    .submit-btn { 
      width: 100%; 
      height: 48px; 
      font-size: 16px; 
      margin-top: 8px; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      gap: 8px; 
    }
    
    // Dark mode specific styles
    :host-context(.dark-mode) .error-msg {
      background: #2e1a1a;
      color: #e57373;
    }
  `]
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private fb = inject(FormBuilder);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = false;
  showPass = false;
  error = '';

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading = true;
    this.error = '';
    console.log('🔐 Attempting login...', { email: this.form.value.email });
    this.auth.login(this.form.value as any).subscribe({
      next: (res) => { 
        console.log('✅ Login success', res);
        this.router.navigate(['/dashboard']); 
      },
      error: err => {
        console.error('❌ Login error', err);
        this.loading = false;
        this.error = err.error?.message || err.message || 'Invalid credentials';
      }
    });
  }
}
