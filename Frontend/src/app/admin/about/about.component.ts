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
import { MediaPickerComponent } from '../../admin/shared/media-picker/media-picker.component';
import { MediaResponse } from '../../core/models/media.model';
import { finalize } from 'rxjs/operators';

const SECTION_TYPES = [
  { id: 1, key: 'about', title: 'About' },
  { id: 2, key: 'why_choose_us', title: 'Why Choose Us' },
  { id: 3, key: 'chairman_message', title: 'Chairman Message' },
  { id: 4, key: 'company_overview', title: 'Company Overview' }
];

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
      <mat-tab *ngFor="let type of sectionTypes" [label]="type.title">
        <div class="card" style="margin-top:16px">
          <form [formGroup]="getForms(type.key)" (ngSubmit)="save(type.key)">
            <div class="form-grid">
              <mat-form-field appearance="outline" class="form-full">
                <mat-label>Content</mat-label>
                <textarea matInput [formControl]="getForms(type.key).controls['content']" rows="8"></textarea>
              </mat-form-field>
            </div>
            <div style="margin-top:16px">
              <button mat-flat-button color="primary" type="submit" [disabled]="saving[type.key]">
                <mat-spinner *ngIf="saving[type.key]" diameter="20"></mat-spinner>
                <span *ngIf="!saving[type.key]">Save</span>
              </button>
            </div>
          </form>
        </div>
      </mat-tab>
    </mat-tab-group>
  `,
  styles: [`
    @media (max-width: 768px) {
      mat-tab-group {
        ::ng-deep .mat-mdc-tab-labels {
          justify-content: flex-start;
        }
        
        ::ng-deep .mat-mdc-tab-label {
          min-width: 100px;
          padding: 0 12px;
          font-size: 13px;
        }
      }
      
      .form-grid {
        grid-template-columns: 1fr;
      }
    }

    @media (max-width: 480px) {
      mat-tab-group {
        ::ng-deep .mat-mdc-tab-label {
          min-width: 80px;
          padding: 0 8px;
          font-size: 12px;
        }
      }
    }
  `]
})
export class AboutComponent implements OnInit {
  private svc = inject(MiscService);
  private snack = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  sectionTypes = SECTION_TYPES;
  sections: Record<string, AboutSectionResponse | null> = {};
  forms: Record<string, any> = {};
  saving: Record<string, boolean> = {};
  loading = false;

  ngOnInit() {
    SECTION_TYPES.forEach(t => {
      this.forms[t.key] = this.fb.group({ content: [''] });
      this.saving[t.key] = false;
      this.sections[t.key] = null;
    });
    this.load();
  }

  load() {
    this.loading = true;
    this.cdr.detectChanges();
    
    this.svc.getAboutSections().pipe(
      finalize(() => {
        this.loading = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: r => {
        console.log('About sections loaded:', r);
        const items = r.data?.content || [];
        // Map items by ID to section types
        SECTION_TYPES.forEach(type => {
          const item = items.find(s => s.id === type.id);
          if (item) {
            this.sections[type.key] = item;
            this.forms[type.key]?.patchValue({ content: item.description || '' });
          }
        });
      },
      error: (err) => {
        console.error('Error loading about sections:', err);
        this.snack.open('Error loading data. Check console for details.', '', { duration: 5000 });
      }
    });
  }

  getForms(type: string) { return this.forms[type]; }

  save(typeKey: string) {
    const typeConfig = SECTION_TYPES.find(t => t.key === typeKey);
    if (!typeConfig) return;
    
    const val = this.forms[typeKey].value;
    
    // Only send description field
    const req = { 
      description: val.content
    };
    
    console.log('Saving about section:', typeConfig.id, req);
    
    // Always update using the fixed ID
    this.saving[typeKey] = true;
    this.cdr.detectChanges();
    
    this.svc.updateAboutSection(typeConfig.id, req).pipe(
      finalize(() => {
        this.saving[typeKey] = false;
        this.cdr.detectChanges();
      })
    ).subscribe({
      next: res => {
        console.log('Save response:', res);
        this.sections[typeKey] = res.data;
        this.snack.open('Saved!', '', { duration: 2000 });
      },
      error: err => {
        console.error('Save error:', err);
        this.snack.open(err.error?.message || 'Error saving. Check console for details.', '', { duration: 5000 });
      }
    });
  }
}

