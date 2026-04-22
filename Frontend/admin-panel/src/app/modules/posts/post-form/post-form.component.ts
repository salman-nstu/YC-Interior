import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MiscService } from '../../../core/services/misc.service';
import { MediaPickerComponent } from '../../../shared/media-picker/media-picker.component';
import { MediaResponse } from '../../../core/models/media.model';

@Component({
  selector: 'app-post-form',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, RouterModule,
    MatFormFieldModule, MatInputModule, MatSelectModule,
    MatButtonModule, MatIconModule, MatSnackBarModule,
    MatProgressSpinnerModule, MediaPickerComponent
  ],
  template: `
    <div class="page-header">
      <h1>{{ isEdit ? 'Edit Post' : 'New Post' }}</h1>
      <a mat-button routerLink="/admin/posts"><mat-icon>arrow_back</mat-icon> Back</a>
    </div>
    <div class="card">
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <mat-form-field appearance="outline" class="form-full">
            <mat-label>Title *</mat-label>
            <input matInput formControlName="title">
            <mat-error>Title is required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Slug</mat-label>
            <input matInput formControlName="slug">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Category</mat-label>
            <mat-select formControlName="categoryId">
              <mat-option [value]="null">None</mat-option>
              <mat-option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</mat-option>
            </mat-select>
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
            <textarea matInput formControlName="description" rows="6"></textarea>
          </mat-form-field>
          <div>
            <label style="font-size:13px;color:#757575;display:block;margin-bottom:8px">Cover Image *</label>
            <app-media-picker [value]="coverMedia" category="general" (valueChange)="coverMedia = $event"></app-media-picker>
            <div *ngIf="showCoverError" style="color:#c62828;font-size:12px;margin-top:4px">Cover image is required</div>
          </div>
        </div>
        <div style="display:flex;gap:12px;margin-top:24px">
          <button mat-flat-button color="primary" type="submit" [disabled]="saving">
            <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
            <span *ngIf="!saving">{{ isEdit ? 'Update' : 'Create' }}</span>
          </button>
          <a mat-button routerLink="/admin/posts">Cancel</a>
        </div>
      </form>
    </div>
  `
})
export class PostFormComponent implements OnInit {
  private svc = inject(MiscService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snack = inject(MatSnackBar);

  form = this.fb.group({
    title: ['', Validators.required],
    slug: [''],
    description: [''],
    categoryId: [null as number | null],
    status: ['published']
  });

  categories: any[] = [];
  coverMedia: MediaResponse | null = null;
  isEdit = false;
  saving = false;
  showCoverError = false;
  private editId: number | null = null;

  ngOnInit() {
    this.svc.getPostCategories().subscribe(r => this.categories = r.data || []);
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true; this.editId = +id;
      // Load post by id - we'll use the list and find it
      this.svc.getPosts(undefined, undefined, undefined, 0, 100).subscribe(r => {
        const post = r.data?.content.find(p => p.id === +id!);
        if (post) {
          this.form.patchValue({ title: post.title, slug: post.slug, description: post.description, categoryId: post.categoryId, status: post.status });
          this.coverMedia = post.coverMedia || null;
        }
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
    const req = { ...this.form.value, coverMediaId: this.coverMedia?.id } as any;
    const obs = this.isEdit ? this.svc.updatePost(this.editId!, req) : this.svc.createPost(req);
    obs.subscribe({
      next: () => { this.snack.open(this.isEdit ? 'Updated!' : 'Created!', '', { duration: 2000 }); this.router.navigate(['/admin/posts']); },
      error: err => { this.saving = false; this.snack.open(err.error?.message || 'Error', '', { duration: 3000 }); }
    });
  }
}
