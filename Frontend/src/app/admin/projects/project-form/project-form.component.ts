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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ProjectService } from '../../../core/services/project.service';
import { MediaPickerComponent, MediaPickerDialogComponent } from '../../shared/media-picker/media-picker.component';
import { MediaResponse } from '../../../core/models/media.model';

@Component({
  selector: 'app-project-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatCheckboxModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatDialogModule,
    MediaPickerComponent
  ],
  template: `
    <div class="page-header">
      <h1>{{ isEdit ? 'Edit Project' : 'New Project' }}</h1>
      <a mat-button routerLink="/admin/projects"><mat-icon>arrow_back</mat-icon> Back</a>
    </div>

    <div class="card">
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Title *</mat-label>
            <input matInput formControlName="title">
            <mat-error>Title is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Slug</mat-label>
            <input matInput formControlName="slug" placeholder="auto-generated if empty">
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Category *</mat-label>
            <mat-select formControlName="categoryType">
              <mat-option value="Residential">Residential</mat-option>
              <mat-option value="Commercial">Commercial</mat-option>
            </mat-select>
            <mat-error>Category is required</mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="published">Published</mat-option>
              <mat-option value="draft">Draft</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="form-full">
            <mat-label>Description</mat-label>
            <textarea matInput formControlName="description" rows="5"></textarea>
          </mat-form-field>

          <div>
            <label class="field-label">Cover Image *</label>
            <app-media-picker
              [value]="coverMedia"
              category="project"
              (valueChange)="onCoverChange($event)">
            </app-media-picker>
            <div *ngIf="showCoverError" class="error-message">Cover image is required</div>
          </div>

          <div>
            <mat-checkbox formControlName="isFeatured" color="primary">Featured</mat-checkbox>
            <mat-form-field appearance="outline" style="margin-top:8px;width:100%">
              <mat-label>Display Order</mat-label>
              <input matInput type="number" formControlName="displayOrder" min="0" step="1">
            </mat-form-field>
          </div>

          <div class="form-full">
            <label class="field-label">Additional Images</label>
            <div class="preview-grid">
              <div class="preview-item" *ngFor="let img of additionalImages; let i = index">
                <img [src]="img.url" [alt]="img.altText">
                <button class="remove-btn" type="button" (click)="removeImage(i)">
                  <mat-icon>close</mat-icon>
                </button>
              </div>
              <div class="add-image-btn" (click)="openImagePicker()">
                <mat-icon>add_photo_alternate</mat-icon>
                <span>Add</span>
              </div>
            </div>
          </div>
        </div>

        <div style="display:flex;gap:12px;margin-top:24px">
          <button mat-flat-button color="primary" type="submit" [disabled]="saving">
            <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
            <span *ngIf="!saving">{{ isEdit ? 'Update' : 'Create' }}</span>
          </button>
          <a mat-button routerLink="/admin/projects">Cancel</a>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .field-label { font-size: 13px; color: var(--text-muted); display: block; margin-bottom: 8px; }
    .error-message { color: #c62828; font-size: 12px; margin-top: 4px; }
    .add-image-btn {
      border: 2px dashed var(--border); border-radius: 8px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      cursor: pointer; aspect-ratio: 1; gap: 4px; color: var(--text-muted);
      &:hover { border-color: var(--matcha); color: var(--matcha); }
      mat-icon { font-size: 28px; width: 28px; height: 28px; }
      span { font-size: 12px; }
    }

    @media (max-width: 768px) {
      .form-grid {
        grid-template-columns: 1fr;
      }
      
      .preview-grid {
        grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
        gap: 8px;
      }
      
      .add-image-btn {
        mat-icon {
          font-size: 24px;
          width: 24px;
          height: 24px;
        }
        
        span {
          font-size: 11px;
        }
      }
    }

    @media (max-width: 480px) {
      .preview-grid {
        grid-template-columns: repeat(3, 1fr);
      }
    }
  `]
})
export class ProjectFormComponent implements OnInit {
  private svc = inject(ProjectService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  form = this.fb.group({
    title: ['', Validators.required],
    slug: [''],
    description: [''],
    categoryType: ['Residential', Validators.required],
    status: ['published'],
    isFeatured: [false],
    displayOrder: [0]
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
      this.isEdit = true;
      this.editId = +id;
      this.svc.getById(+id).subscribe(res => {
        const p = res.data;
        this.form.patchValue({
          title: p.title, slug: p.slug, description: p.description,
          categoryType: p.categoryType, status: p.status,
          isFeatured: p.isFeatured, displayOrder: p.displayOrder
        });
        this.coverMedia = p.coverMedia || null;
        this.additionalImages = p.images || [];
      });
    }
  }

  onCoverChange(m: MediaResponse | null) { this.coverMedia = m; }

  openImagePicker() {
    this.dialog.open(MediaPickerDialogComponent, { data: { category: 'project' }, width: '700px' })
      .afterClosed().subscribe((r: MediaResponse) => { if (r) this.additionalImages.push(r); });
  }

  removeImage(i: number) { this.additionalImages.splice(i, 1); }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    
    // Validate cover image
    if (!this.coverMedia) {
      this.showCoverError = true;
      return;
    }
    this.showCoverError = false;
    
    this.saving = true;
    const req = {
      ...this.form.value,
      coverMediaId: this.coverMedia?.id || undefined,
      imageMediaIds: this.additionalImages.map(i => i.id)
    } as any;

    const obs = this.isEdit
      ? this.svc.update(this.editId!, req)
      : this.svc.create(req);

    obs.subscribe({
      next: () => {
        this.snack.open(this.isEdit ? 'Updated!' : 'Created!', '', { duration: 2000 });
        this.router.navigate(['/admin/projects']);
      },
      error: err => {
        this.saving = false;
        this.snack.open(err.error?.message || 'Error', '', { duration: 3000 });
      }
    });
  }
}
