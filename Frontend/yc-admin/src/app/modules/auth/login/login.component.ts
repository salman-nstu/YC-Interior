import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-page">
      <div class="login-bg"></div>
      <div class="login-card">
        <div class="login-header">
          <div class="login-logo">🌿</div>
          <h1 class="login-title">YC Interior</h1>
          <p class="login-subtitle">Admin Panel — Sign in to continue</p>
        </div>
        <form [formGroup]="form" (ngSubmit)="submit()" class="login-form">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input type="email" formControlName="email" class="form-control"
                   [class.is-invalid]="submitted && f['email'].errors"
                   placeholder="admin@example.com" id="login-email" />
            <div class="form-error" *ngIf="submitted && f['email'].errors?.['required']">Email is required</div>
            <div class="form-error" *ngIf="submitted && f['email'].errors?.['email']">Invalid email format</div>
          </div>
          <div class="form-group">
            <label class="form-label">Password</label>
            <div style="position:relative">
              <input [type]="showPass ? 'text' : 'password'" formControlName="password" class="form-control"
                     [class.is-invalid]="submitted && f['password'].errors"
                     placeholder="••••••••" id="login-password" style="padding-right:44px" />
              <button type="button" class="pass-toggle" (click)="showPass = !showPass">{{showPass ? '🙈' : '👁️'}}</button>
            </div>
            <div class="form-error" *ngIf="submitted && f['password'].errors?.['required']">Password is required</div>
          </div>
          <div class="form-error" *ngIf="error" style="margin-bottom:12px;font-size:13px">⚠️ {{error}}</div>
          <button type="submit" class="btn btn-primary btn-lg" style="width:100%" [disabled]="loading">
            <span *ngIf="!loading">Sign In →</span>
            <span *ngIf="loading">Signing in...</span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-page { min-height:100vh; display:flex; align-items:center; justify-content:center; background:var(--bg); position:relative; overflow:hidden; }
    .login-bg { position:absolute; inset:0; background:linear-gradient(135deg, #2D3B28 0%, #3D5235 40%, #5C7A4E 100%); opacity:0.92; }
    .login-card { position:relative; z-index:1; background:rgba(255,255,255,0.98); border-radius:20px; padding:48px 44px; width:100%; max-width:420px; box-shadow:0 24px 64px rgba(0,0,0,0.3); }
    .login-header { text-align:center; margin-bottom:36px; }
    .login-logo { font-size:48px; margin-bottom:12px; }
    .login-title { font-size:26px; font-weight:800; color:#1A2614; margin-bottom:6px; }
    .login-subtitle { font-size:14px; color:#566451; }
    .login-form { display:flex; flex-direction:column; gap:4px; }
    .pass-toggle { position:absolute; right:12px; top:50%; transform:translateY(-50%); background:none; border:none; cursor:pointer; font-size:18px; padding:4px; }
  `]
})
export class LoginComponent {
  form: FormGroup;
  submitted = false;
  loading = false;
  error = '';
  showPass = false;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get f() { return this.form.controls; }

  submit() {
    this.submitted = true; this.error = '';
    if (this.form.invalid) return;
    this.loading = true;
    this.authService.login(this.form.value).subscribe({
      next: res => {
        if (res.success) this.router.navigate(['/dashboard']);
        else { this.error = res.message; this.loading = false; }
      },
      error: err => {
        this.error = err.error?.message || 'Invalid credentials';
        this.loading = false;
      }
    });
  }
}
