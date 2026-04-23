import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MiscService } from '../../core/services/misc.service';
import { MediaPickerComponent } from '../../shared/media-picker/media-picker.component';
import { MediaResponse } from '../../core/models/media.model';
import { SettingsStateService } from '../../core/services/settings-state.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatTabsModule, MediaPickerComponent
  ],
  template: `
    <div class="page-header">
      <h1>Settings</h1>
    </div>

    <div *ngIf="loading" style="display:flex;justify-content:center;padding:40px"><mat-spinner diameter="40"></mat-spinner></div>

    <div class="card" *ngIf="!loading">
      <form [formGroup]="form" (ngSubmit)="save()">
        <mat-tab-group>
          <!-- General -->
          <mat-tab label="General">
            <div class="form-grid" style="margin-top:16px">
              <mat-form-field appearance="outline" class="form-full">
                <mat-label>Site Name</mat-label>
                <input matInput formControlName="siteName">
              </mat-form-field>
              <div>
                <label style="font-size:13px;color:#757575;display:block;margin-bottom:8px">Logo</label>
                <app-media-picker [value]="logoMedia" category="settings" (valueChange)="logoMedia = $event"></app-media-picker>
              </div>
              <div>
                <label style="font-size:13px;color:#757575;display:block;margin-bottom:8px">Favicon</label>
                <app-media-picker [value]="faviconMedia" category="settings" (valueChange)="faviconMedia = $event"></app-media-picker>
              </div>
            </div>
          </mat-tab>

          <!-- Contact -->
          <mat-tab label="Contact">
            <div class="form-grid" style="margin-top:16px">
              <mat-form-field appearance="outline">
                <mat-label>Email</mat-label>
                <input matInput formControlName="email" type="email">
                <mat-icon matPrefix>email</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Phone</mat-label>
                <input matInput formControlName="phone">
                <mat-icon matPrefix>phone</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="outline" class="form-full">
                <mat-label>Address</mat-label>
                <textarea matInput formControlName="address" rows="3"></textarea>
                <mat-icon matPrefix>location_on</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="outline" class="form-full">
                <mat-label>Map Embed URL</mat-label>
                <input matInput formControlName="mapEmbedUrl">
              </mat-form-field>
            </div>
          </mat-tab>

          <!-- Social -->
          <mat-tab label="Social Media">
            <div class="form-grid" style="margin-top:16px">
              <mat-form-field appearance="outline">
                <mat-label>Facebook URL</mat-label>
                <input matInput formControlName="facebookUrl">
                <mat-icon matPrefix>facebook</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>Instagram URL</mat-label>
                <input matInput formControlName="instagramUrl">
                <mat-icon matPrefix>photo_camera</mat-icon>
              </mat-form-field>
              <mat-form-field appearance="outline">
                <mat-label>LinkedIn URL</mat-label>
                <input matInput formControlName="linkedinUrl">
                <mat-icon matPrefix>work</mat-icon>
              </mat-form-field>
            </div>
          </mat-tab>
        </mat-tab-group>

        <div style="margin-top:24px">
          <button mat-flat-button color="primary" type="submit" [disabled]="saving">
            <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
            <span *ngIf="!saving">Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  `
})
export class SettingsComponent implements OnInit {
  private svc = inject(MiscService);
  private snack = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);
  private settingsState = inject(SettingsStateService);

  form = this.fb.group({
    siteName: [''],
    email: [''],
    phone: [''],
    address: [''],
    mapEmbedUrl: [''],
    facebookUrl: [''],
    instagramUrl: [''],
    linkedinUrl: ['']
  });

  logoMedia: MediaResponse | null = null;
  faviconMedia: MediaResponse | null = null;
  loading = false;
  saving = false;

  ngOnInit() {
    this.zone.run(() => {
      this.loading = true;
      this.cdr.markForCheck();
    });
    
    this.svc.getSettings().subscribe({
      next: r => {
        this.zone.run(() => {
          const s = r.data;
          if (s) {
            this.form.patchValue({
              siteName: s.siteName, email: s.email, phone: s.phone,
              address: s.address, mapEmbedUrl: s.mapEmbedUrl,
              facebookUrl: s.facebookUrl, instagramUrl: s.instagramUrl, linkedinUrl: s.linkedinUrl
            });
            this.logoMedia = s.logoMedia || null;
            this.faviconMedia = s.faviconMedia || null;
            this.settingsState.updateSettings(s);
          }
          this.loading = false;
          this.cdr.markForCheck();
        });
      },
      error: () => {
        this.zone.run(() => {
          this.loading = false;
          this.cdr.markForCheck();
        });
      }
    });
  }

  save() {
    setTimeout(() => {
      this.saving = true;
      this.cdr.detectChanges();
      
      const req = {
        ...this.form.value,
        logoMediaId: this.logoMedia?.id,
        faviconMediaId: this.faviconMedia?.id
      } as any;
      
      this.svc.updateSettings(req).subscribe({
        next: (response) => { 
          this.saving = false; 
          this.cdr.detectChanges();
          this.settingsState.updateSettings(response.data);
          this.snack.open('Settings saved!', '', { duration: 2000 }); 
        },
        error: err => { 
          this.saving = false; 
          this.cdr.detectChanges();
          this.snack.open(err.error?.message || 'Error', '', { duration: 3000 }); 
        }
      });
    });
  }
}
