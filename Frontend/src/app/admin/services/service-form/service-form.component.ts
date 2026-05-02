import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ServiceService } from '../../../core/services/service.service';
import { MediaPickerComponent } from '../../shared/media-picker/media-picker.component';
import { MediaResponse } from '../../../core/models/media.model';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatCheckboxModule,
    MatSnackBarModule, MatProgressSpinnerModule, MediaPickerComponent
  ],
  template: `
    <div class="page-header">
      <h1>{{ isEdit ? 'Edit Service' : 'New Service' }}</h1>
      <a mat-button routerLink="/admin/services"><mat-icon>arrow_back</mat-icon> Back</a>
    </div>
    <div class="card">
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <mat-form-field appearance="outline" class="form-full">
            <mat-label>Title *</mat-label>
            <input matInput formControlName="title">
            <mat-error>Title is required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="form-full">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="5"></textarea>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="published">Published</mat-option>
              <mat-option value="draft">Draft</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Display Order</mat-label>
            <input matInput type="number" formControlName="displayOrder" min="0" step="1">
          </mat-form-field>
          <div>
            <label style="font-size:13px;color:#757575;display:block;margin-bottom:8px">Cover Image *</label>
            <app-media-picker [value]="coverMedia" category="service" (valueChange)="coverMedia = $event"></app-media-picker>
            <div *ngIf="showCoverError" style="color:#c62828;font-size:12px;margin-top:4px">Cover image is required</div>
          </div>
          <div>
            <mat-checkbox formControlName="isActive" color="primary">Active</mat-checkbox>
          </div>
          <div class="form-full">
            <label style="font-size:13px;color:#757575;display:block;margin-bottom:8px">Additional Images</label>
            <div class="preview-grid">
              <div class="preview-item" *ngFor="let img of additionalImages; let i = index">
                <img [src]="img.url" [alt]="img.altText">
                <button class="remove-btn" type="button" (click)="additionalImages.splice(i,1)">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style="display:flex;gap:12px;margin-top:24px">
          <button mat-flat-button color="primary" type="submit" [disabled]="saving">
            <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
            <span *ngIf="!saving">{{ isEdit ? 'Update' : 'Create' }}</span>
          </button>
          <a mat-button routerLink="/admin/services">Cancel</a>
        </div>
      </form>
    </div>
  `
})
export class ServiceFormComponent implements OnInit {
  private svc = inject(ServiceService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);

  form = this.fb.group({
    title: ['', Validators.required],
    description: [''],
    status: ['published'],
    displayOrder: [0],
    isActive: [true]
  });

  coverMedia: MediaResponse | null = null;
  additionalImages: MediaResponse[] = [];
  isEdit = false;
  saving = false;
  showCoverError = false;
  private editId: number | null = null;

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true; this.editId = +id;
      this.svc.getById(+id).subscribe(res => {
        const s = res.data;
        this.form.patchValue({ title: s.title, description: s.description, status: s.status, displayOrder: s.displayOrder, isActive: s.isActive });
        this.coverMedia = s.coverMedia || null;
        this.additionalImages = s.images || [];
      });
    }
  }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    
    // Validate cover image
    if (!this.coverMedia) {
      this.showCoverError = true;
      return;
    }
    this.showCoverError = false;
    
    this.saving = true;
    const req = { ...this.form.value, coverMediaId: this.coverMedia?.id, imageMediaIds: this.additionalImages.map(i => i.id) } as any;
    const obs = this.isEdit ? this.svc.update(this.editId!, req) : this.svc.create(req);
    obs.subscribe({
      next: () => { this.snack.open(this.isEdit ? 'Updated!' : 'Created!', '', { duration: 2000 }); this.router.navigate(['/admin/services']); },
      error: err => { this.saving = false; this.snack.open(err.error?.message || 'Error', '', { duration: 3000 }); }
    });
  }
}
