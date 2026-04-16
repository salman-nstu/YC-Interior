import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { ToastService } from '../../../core/services/toast.service';
import { ProjectCategory } from '../../../core/models/models';

@Component({
  selector: 'app-project-categories',
  template: `
    <div>
      <div class="page-header">
        <div>
          <h1 class="page-title">Project Categories</h1>
          <p class="page-subtitle">Manage project categories</p>
        </div>
        <button class="btn btn-ghost" routerLink="/projects">← Back to Projects</button>
      </div>
      <div class="grid-2" style="gap:24px;align-items:start">
        <div class="card">
          <div class="card-body">
            <h3 style="font-size:14px;font-weight:700;margin-bottom:16px">{{editId ? 'Edit Category' : 'New Category'}}</h3>
            <form [formGroup]="form" (ngSubmit)="submit()">
              <div class="form-group">
                <label class="form-label">Category Name <span class="required">*</span></label>
                <input type="text" formControlName="name" class="form-control" placeholder="e.g. Residential" id="category-name-input" />
                <div class="form-error" *ngIf="submitted && form.get('name')?.errors?.['required']">Name is required</div>
              </div>
              <div class="flex gap-8">
                <button type="submit" class="btn btn-primary btn-sm">{{editId ? 'Update' : 'Create'}}</button>
                <button type="button" class="btn btn-ghost btn-sm" *ngIf="editId" (click)="cancelEdit()">Cancel</button>
              </div>
            </form>
          </div>
        </div>
        <div class="card">
          <div class="table-container">
            <table class="table">
              <thead><tr><th>Name</th><th>Created</th><th>Actions</th></tr></thead>
              <tbody>
                <tr *ngFor="let c of categories">
                  <td class="font-semibold" style="font-size:13px">{{c.name}}</td>
                  <td class="text-muted" style="font-size:12px">{{c.createdAt | date}}</td>
                  <td>
                    <div class="flex gap-8">
                      <button class="btn-icon" (click)="edit(c)" [id]="'edit-cat-'+c.id">✏️</button>
                      <button class="btn-icon danger" (click)="remove(c.id)" [id]="'delete-cat-'+c.id">🗑️</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProjectCategoriesComponent implements OnInit {
  form!: FormGroup;
  categories: ProjectCategory[] = [];
  submitted = false;
  editId: number | null = null;

  constructor(private fb: FormBuilder, private api: ApiService, private toast: ToastService) {}

  ngOnInit() {
    this.form = this.fb.group({ name: ['', Validators.required] });
    this.load();
  }

  load() { this.api.getProjectCategoriesList().subscribe(res => this.categories = res.data || []); }

  submit() {
    this.submitted = true;
    if (this.form.invalid) return;
    const obs = this.editId ? this.api.updateProjectCategory(this.editId, this.form.value) : this.api.createProjectCategory(this.form.value);
    obs.subscribe({
      next: () => { this.toast.success(this.editId ? 'Updated' : 'Created'); this.form.reset(); this.editId = null; this.submitted = false; this.load(); },
      error: err => this.toast.error(err.error?.message || 'Error')
    });
  }

  edit(c: ProjectCategory) { this.editId = c.id; this.form.patchValue({ name: c.name }); }
  cancelEdit() { this.editId = null; this.form.reset(); this.submitted = false; }

  remove(id: number) {
    if (!confirm('Delete this category?')) return;
    this.api.deleteProjectCategory(id).subscribe({ next: () => { this.toast.success('Deleted'); this.load(); }, error: () => this.toast.error('Failed') });
  }
}
