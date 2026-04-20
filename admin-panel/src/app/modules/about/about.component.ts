import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MiscService } from '../../core/services/misc.service';
import { AboutSectionResponse } from '../../core/models/misc.model';
import { MediaPickerComponent } from '../../shared/media-picker/media-picker.component';
import { MediaResponse } from '../../core/models/media.model';

const SECTION_TYPES = ['about', 'why_choose_us', 'chairman_message', 'company_overview'];

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatButtonModule, MatIconModule, MatFormFieldModule, MatInputModule, MatSelectModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatTabsModule, MediaPickerComponent
  ],
  template: `
    <div class="page-header">
      <h1>About / Static Content</h1>
    </div>

    <div *ngIf="loading" style="display:flex;justify-content:center;padding:40px"><mat-spinner diameter="40"></mat-spinner></div>

    <mat-tab-group *ngIf="!loading">
      <mat-tab *ngFor="let type of sectionTypes" [label]="formatType(type)">
        <div class="card" style="margin-top:16px">
          <form [formGroup]="getForms(type)" (ngSubmit)="save(type)">
            <div class="form-grid">
              <mat-form-field appearance="outline" class="form-full">
                <mat-label>Title</mat-label>
                <input matInput [formControl]="getForms(type).controls['title']">
              </mat-form-field>
              <mat-form-field appearance="outline" class="form-full">
                <mat-label>Content</mat-label>
                <textarea matInput [formControl]="getForms(type).controls['content']" rows="8"></textarea>
              </mat-form-field>
              <div>
                <label style="font-size:13px;color:#757575;display:block;margin-bottom:8px">Image</label>
                <app-media-picker
                  [value]="getMedia(type)"
                  category="about"
                  (valueChange)="setMedia(type, $event)">
                </app-media-picker>
              </div>
            </div>
            <div style="margin-top:16px">
              <button mat-flat-button color="primary" type="submit" [disabled]="saving[type]">
                <mat-spinner *ngIf="saving[type]" diameter="20"></mat-spinner>
                <span *ngIf="!saving[type]">Save</span>
              </button>
            </div>
          </form>
        </div>
      </mat-tab>
    </mat-tab-group>
  `
})
export class AboutComponent implements OnInit {
  private svc = inject(MiscService);
  private snack = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  sectionTypes = SECTION_TYPES;
  sections: Record<string, AboutSectionResponse | null> = {};
  mediaMap: Record<string, MediaResponse | null> = {};
  forms: Record<string, any> = {};
  saving: Record<string, boolean> = {};
  loading = false;

  ngOnInit() {
    SECTION_TYPES.forEach(t => {
      this.forms[t] = this.fb.group({ title: [''], content: [''] });
      this.saving[t] = false;
      this.sections[t] = null;
      this.mediaMap[t] = null;
    });
    this.load();
  }

  load() {
    this.zone.run(() => {
      this.loading = true;
      this.cdr.markForCheck();
    });
    
    this.svc.getAboutSections().subscribe({
      next: r => {
        this.zone.run(() => {
          (r.data?.content || []).forEach(s => {
            this.sections[s.type] = s;
            this.forms[s.type]?.patchValue({ title: s.title, content: s.content });
            this.mediaMap[s.type] = s.media || null;
          });
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

  getForms(type: string) { return this.forms[type]; }
  getMedia(type: string): MediaResponse | null { return this.mediaMap[type]; }
  setMedia(type: string, m: MediaResponse | null) { this.mediaMap[type] = m; }

  save(type: string) {
    this.saving[type] = true;
    const val = this.forms[type].value;
    const req = { type, title: val.title, content: val.content, mediaId: this.mediaMap[type]?.id };
    const existing = this.sections[type];
    const obs = existing
      ? this.svc.updateAboutSection(existing.id, req)
      : this.svc.createAboutSection(req);
    obs.subscribe({
      next: res => {
        this.sections[type] = res.data;
        this.saving[type] = false;
        this.snack.open('Saved!', '', { duration: 2000 });
      },
      error: err => { this.saving[type] = false; this.snack.open(err.error?.message || 'Error', '', { duration: 3000 }); }
    });
  }

  formatType(t: string) { return t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()); }
}
