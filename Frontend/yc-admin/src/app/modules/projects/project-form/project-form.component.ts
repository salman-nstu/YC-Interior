import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-project-form',
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">{{isEdit ? 'Edit Project' : 'New Project'}}</h1>
          <p class="page-subtitle">{{isEdit ? 'Update project details' : 'Create a new portfolio project'}}</p>
        </div>
        <button class="btn btn-ghost" routerLink="/projects">← Back</button>
      </div>

      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="grid-2" style="gap:24px;align-items:start">
          <!-- Left Column -->
          <div style="display:flex;flex-direction:column;gap:20px">
            <div class="card">
              <div class="card-body">
                <h3 style="font-size:14px;font-weight:700;margin-bottom:20px;color:var(--text-secondary)">Basic Info</h3>
                <div class="form-group">
                  <label class="form-label">Title <span class="required">*</span></label>
                  <input type="text" formControlName="title" class="form-control" [class.is-invalid]="submitted && f['title'].errors" placeholder="Project title" id="project-title" />
                  <div class="form-error" *ngIf="submitted && f['title'].errors?.['required']">Title is required</div>
                </div>
                <div class="form-group">
                  <label class="form-label">Slug <span style="font-size:11px;color:var(--text-muted)">(auto-generated if empty)</span></label>
                  <input type="text" formControlName="slug" class="form-control" placeholder="project-slug" id="project-slug" />
                </div>
                <div class="form-group">
                  <label class="form-label">Description</label>
                  <textarea formControlName="description" class="form-control" rows="4" placeholder="Project description..." id="project-description"></textarea>
                </div>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h3 style="font-size:14px;font-weight:700;margin-bottom:20px;color:var(--text-secondary)">Settings</h3>
                <div class="form-group">
                  <label class="form-label">Category</label>
                  <select formControlName="categoryId" class="form-select" id="project-category">
                    <option value="">-- Select Category --</option>
                    <option *ngFor="let c of categories" [value]="c.id">{{c.name}}</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Status</label>
                  <select formControlName="status" class="form-select" id="project-status">
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
                <div class="form-group">
                  <label class="form-label">Display Order</label>
                  <input type="number" formControlName="displayOrder" class="form-control" id="project-display-order" />
                </div>
                <label class="toggle-wrap">
                  <div class="toggle">
                    <input type="checkbox" formControlName="isFeatured" id="project-featured" />
                    <span class="slider"></span>
                  </div>
                  <span class="font-medium" style="font-size:13px">Featured Project ⭐</span>
                </label>
              </div>
            </div>
          </div>

          <!-- Right Column -->
          <div style="display:flex;flex-direction:column;gap:20px">
            <div class="card">
              <div class="card-body">
                <h3 style="font-size:14px;font-weight:700;margin-bottom:16px;color:var(--text-secondary)">Cover Image</h3>
                <app-media-picker [mediaId]="form.get('coverMediaId')?.value" category="project"
                  (mediaSelected)="onCoverSelected($event)"></app-media-picker>
              </div>
            </div>

            <div class="card">
              <div class="card-body">
                <h3 style="font-size:14px;font-weight:700;margin-bottom:12px;color:var(--text-secondary)">Additional Images</h3>
                <div class="image-preview-grid" *ngIf="additionalImages.length">
                  <div *ngFor="let img of additionalImages; let i = index" class="image-preview-item">
                    <img [src]="img.url" [alt]="img.fileName" />
                    <button type="button" class="remove-btn" (click)="removeImage(i)">✕</button>
                  </div>
                </div>
                <label style="cursor:pointer;display:inline-block;margin-top:10px" class="btn btn-outline btn-sm">
                  ➕ Add Images
                  <input type="file" multiple accept="image/*" (change)="onAdditionalImages($event)" style="display:none" />
                </label>
              </div>
            </div>
          </div>
        </div>

        <div style="display:flex;justify-content:flex-end;gap:12px;margin-top:24px">
          <button type="button" class="btn btn-ghost" routerLink="/projects">Cancel</button>
          <button type="submit" class="btn btn-primary" [disabled]="saving" id="save-project-btn">
            {{saving ? 'Saving...' : (isEdit ? '💾 Update Project' : '➕ Create Project')}}
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProjectFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  saving = false;
  submitted = false;
  categories: any[] = [];
  additionalImages: any[] = [];
  additionalMediaIds: number[] = [];
  private projectId: number | null = null;

  constructor(private fb: FormBuilder, private api: ApiService, private toast: ToastService,
              private route: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', Validators.required],
      slug: [''],
      description: [''],
      coverMediaId: [null],
      categoryId: [''],
      status: ['published'],
      isFeatured: [false],
      displayOrder: [0]
    });
    this.api.getProjectCategoriesList().subscribe(res => this.categories = res.data || []);
    this.projectId = this.route.snapshot.params['id'];
    if (this.projectId) {
      this.isEdit = true;
      this.api.getProject(this.projectId).subscribe(res => {
        if (res.success) {
          const p = res.data;
          this.form.patchValue({ title: p.title, slug: p.slug, description: p.description,
            coverMediaId: p.coverMediaId, categoryId: p.categoryId, status: p.status,
            isFeatured: p.isFeatured, displayOrder: p.displayOrder });
          if (p.images) { this.additionalImages = p.images; this.additionalMediaIds = p.images.map(i => i.id); }
        }
      });
    }
  }

  get f() { return this.form.controls; }

  onCoverSelected(id: number | null) { this.form.patchValue({ coverMediaId: id }); }

  onAdditionalImages(event: any) {
    const files: File[] = Array.from(event.target.files);
    files.forEach(file => {
      this.api.uploadMedia(file, 'project').subscribe(res => {
        if (res.success) { this.additionalImages.push(res.data); this.additionalMediaIds.push(res.data.id); }
      });
    });
  }

  removeImage(i: number) { this.additionalImages.splice(i, 1); this.additionalMediaIds.splice(i, 1); }

  submit() {
    this.submitted = true;
    if (this.form.invalid) return;
    this.saving = true;
    const payload = { ...this.form.value, categoryId: this.form.value.categoryId || null, imageMediaIds: this.additionalMediaIds };
    const obs = this.isEdit ? this.api.updateProject(this.projectId!, payload) : this.api.createProject(payload);
    obs.subscribe({
      next: () => { this.toast.success(this.isEdit ? 'Updated!' : 'Created!'); this.router.navigate(['/projects']); },
      error: err => { this.toast.error(err.error?.message || 'Error'); this.saving = false; }
    });
  }
}
