import { Component, inject, HostListener, ElementRef, ViewChild } from '@angular/core';
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

        <form [formGroup]="form" (ngSubmit)="submit()" (keydown)="onKeyDown($event)">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input #emailInput matInput type="email" formControlName="email" 
                   (keydown)="onInputKeyDown($event, 'email')" tabindex="1">
            <mat-icon matPrefix>email</mat-icon>
            <mat-error *ngIf="form.get('email')?.hasError('required')">Email is required</mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">Invalid email</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Password</mat-label>
            <input #passwordInput matInput [type]="showPass ? 'text' : 'password'" formControlName="password" 
                   (keydown)="onInputKeyDown($event, 'password')" tabindex="2">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix type="button" (click)="togglePasswordVisibility()" tabindex="-1">
              <mat-icon>{{ showPass ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="form.get('password')?.hasError('required')">Password is required</mat-error>
          </mat-form-field>

          <div *ngIf="error" class="error-msg">{{ error }}</div>

          <button #submitButton mat-flat-button color="primary" type="submit" class="submit-btn" 
                  [disabled]="loading" tabindex="3" (keydown)="onButtonKeyDown($event)">
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

    // Focus styles for better keyboard navigation
    input:focus, button:focus {
      outline: 2px solid var(--matcha) !important;
      outline-offset: 2px;
    }

    // Animation for focus transitions
    input, button {
      transition: all 0.2s ease;
    }

    // Mobile responsive
    @media (max-width: 768px) {
      .login-page {
        padding: 16px;
      }
      
      .login-card {
        padding: 24px;
        max-width: 100%;
      }
      
      .login-header {
        margin-bottom: 24px;
        
        .logo-icon {
          font-size: 40px;
          width: 40px;
          height: 40px;
        }
        
        h1 {
          font-size: 20px;
        }
      }
      
      .submit-btn {
        height: 44px;
        font-size: 15px;
      }
    }

    @media (max-width: 480px) {
      .login-card {
        padding: 20px;
      }
      
      .login-header {
        margin-bottom: 20px;
      }
    }
  `]
})
export class LoginComponent {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('submitButton') submitButton!: ElementRef<HTMLButtonElement>;

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

  // Global keystroke handler
  @HostListener('document:keydown', ['$event'])
  onDocumentKeyDown(event: KeyboardEvent) {
    // Ctrl+L to focus email field
    if (event.ctrlKey && event.key === 'l') {
      event.preventDefault();
      this.focusEmailField();
      return;
    }

    // Ctrl+Enter to submit from anywhere
    if (event.ctrlKey && event.key === 'Enter') {
      event.preventDefault();
      this.submit();
      return;
    }

    // Escape to clear form
    if (event.key === 'Escape') {
      event.preventDefault();
      this.clearForm();
      return;
    }

    // F1 for help/demo credentials
    if (event.key === 'F1') {
      event.preventDefault();
      this.showDemoCredentials();
      return;
    }
  }

  // Form-level keystroke handler
  onKeyDown(event: KeyboardEvent) {
    // Enter key submits form
    if (event.key === 'Enter' && !event.shiftKey && !event.ctrlKey) {
      event.preventDefault();
      this.submit();
    }
  }

  // Input field keystroke handler
  onInputKeyDown(event: KeyboardEvent, field: string) {
    switch (event.key) {
      case 'Enter':
        event.preventDefault();
        if (field === 'email') {
          this.focusPasswordField();
        } else if (field === 'password') {
          this.submit();
        }
        break;
      
      case 'Tab':
        // Let default tab behavior work, but ensure proper focus order
        break;
      
      case 'ArrowDown':
        event.preventDefault();
        if (field === 'email') {
          this.focusPasswordField();
        } else if (field === 'password') {
          this.focusSubmitButton();
        }
        break;
      
      case 'ArrowUp':
        event.preventDefault();
        if (field === 'password') {
          this.focusEmailField();
        }
        break;
    }
  }

  // Button keystroke handler
  onButtonKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.submit();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.focusPasswordField();
    }
  }

  // Focus management methods
  focusEmailField() {
    setTimeout(() => {
      this.emailInput?.nativeElement?.focus();
      this.emailInput?.nativeElement?.select();
    });
  }

  focusPasswordField() {
    setTimeout(() => {
      this.passwordInput?.nativeElement?.focus();
      this.passwordInput?.nativeElement?.select();
    });
  }

  focusSubmitButton() {
    setTimeout(() => {
      this.submitButton?.nativeElement?.focus();
    });
  }

  // Enhanced password visibility toggle
  togglePasswordVisibility() {
    this.showPass = !this.showPass;
    // Maintain focus on password field after toggle
    setTimeout(() => {
      this.passwordInput?.nativeElement?.focus();
    });
  }

  // Clear form with keystroke
  clearForm() {
    this.form.reset();
    this.error = '';
    this.focusEmailField();
    this.snack.open('Form cleared', 'OK', { duration: 2000 });
  }

  // Show demo credentials
  showDemoCredentials() {
    this.snack.open('Demo: admin@yc.com / Use your admin password', 'OK', { duration: 4000 });
    this.form.patchValue({ email: 'admin@yc.com' });
    this.focusPasswordField();
  }

  submit() {
    if (this.form.invalid) { 
      this.form.markAllAsTouched(); 
      // Focus first invalid field
      if (this.form.get('email')?.invalid) {
        this.focusEmailField();
      } else if (this.form.get('password')?.invalid) {
        this.focusPasswordField();
      }
      return; 
    }
    
    this.loading = true;
    this.error = '';
    console.log('🔐 Attempting login...', { email: this.form.value.email });
    console.log('📍 Request will be sent to: /auth/login (proxied to http://localhost:8080)');
    
    this.auth.login(this.form.value as any).subscribe({
      next: (res) => { 
        console.log('✅ Login success', res);
        this.router.navigate(['/admin/dashboard']); 
      },
      error: err => {
        console.error('❌ Login error', err);
        console.error('📍 Full error:', err);
        this.loading = false;
        this.error = err.error?.message || err.message || 'Invalid credentials';
        // Focus password field for retry
        this.focusPasswordField();
      }
    });
  }
}
