import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MiscService } from '../../core/services/misc.service';
import { ReviewResponse } from '../../core/models/misc.model';
import { MediaPickerComponent } from '../../shared/media-picker/media-picker.component';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { MediaResponse } from '../../core/models/media.model';

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatSelectModule, MatCheckboxModule,
    MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, MatPaginatorModule,
    MediaPickerComponent
  ],
  template: `
    <div class="page-header">
      <h1>Reviews</h1>
      <button mat-flat-button color="primary" (click)="openForm()"><mat-icon>add</mat-icon> Add Review</button>
    </div>
    <div class="table-container">
      <div *ngIf="loading" style="display:flex;justify-content:center;padding:40px"><mat-spinner diameter="40"></mat-spinner></div>
      <table mat-table [dataSource]="items" *ngIf="!loading">
        <ng-container matColumnDef="photo">
          <th mat-header-cell *matHeaderCellDef>Photo</th>
          <td mat-cell *matCellDef="let row">
            <img *ngIf="row.media" [src]="row.media.url" class="thumb" style="border-radius:50%" [alt]="row.name">
            <mat-icon *ngIf="!row.media" style="color:#ccc">person</mat-icon>
          </td>
        </ng-container>
        <ng-container matColumnDef="name">
          <th mat-header-cell *matHeaderCellDef>Name</th>
          <td mat-cell *matCellDef="let row">
            <strong>{{ row.name }}</strong>
            <div style="font-size:12px;color:#757575">{{ row.designation }}</div>
          </td>
        </ng-container>
        <ng-container matColumnDef="rating">
          <th mat-header-cell *matHeaderCellDef>Rating</th>
          <td mat-cell *matCellDef="let row">
            <span class="stars">{{ '★'.repeat(row.rating) }}{{ '☆'.repeat(5 - row.rating) }}</span>
          </td>
        </ng-container>
        <ng-container matColumnDef="featured">
          <th mat-header-cell *matHeaderCellDef>Featured</th>
          <td mat-cell *matCellDef="let row">
            <span class="badge" [ngClass]="row.isFeatured ? 'featured' : 'inactive'">{{ row.isFeatured ? 'Yes' : 'No' }}</span>
          </td>
        </ng-container>
        <ng-container matColumnDef="actions">
          <th mat-header-cell *matHeaderCellDef>Actions</th>
          <td mat-cell *matCellDef="let row">
            <button mat-icon-button (click)="openForm(row)"><mat-icon>edit</mat-icon></button>
            <button mat-icon-button color="warn" (click)="delete(row)"><mat-icon>delete</mat-icon></button>
          </td>
        </ng-container>
        <tr mat-header-row *matHeaderRowDef="cols"></tr>
        <tr mat-row *matRowDef="let row; columns: cols;"></tr>
      </table>
      <mat-paginator [length]="total" [pageSize]="pageSize" [pageSizeOptions]="[10,25]" (page)="onPage($event)"></mat-paginator>
    </div>

    <div class="card mt-24" *ngIf="showForm">
      <h3 style="margin-bottom:16px">{{ editItem ? 'Edit Review' : 'Add Review' }}</h3>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Name *</mat-label>
            <input matInput formControlName="name">
            <mat-error>Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Designation</mat-label>
            <input matInput formControlName="designation">
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Rating (1-5) *</mat-label>
            <mat-select formControlName="rating">
              <mat-option [value]="1">1 ★</mat-option>
              <mat-option [value]="2">2 ★★</mat-option>
              <mat-option [value]="3">3 ★★★</mat-option>
              <mat-option [value]="4">4 ★★★★</mat-option>
              <mat-option [value]="5">5 ★★★★★</mat-option>
            </mat-select>
            <mat-error>Required</mat-error>
          </mat-form-field>
          <div>
            <mat-checkbox formControlName="isFeatured" color="primary">Featured</mat-checkbox>
          </div>
          <mat-form-field appearance="outline" class="form-full">
            <mat-label>Review Text</mat-label>
            <textarea matInput formControlName="description" rows="4"></textarea>
          </mat-form-field>
          <div>
            <label style="font-size:13px;color:#757575;display:block;margin-bottom:8px">Photo</label>
            <app-media-picker [value]="reviewMedia" category="review" (valueChange)="reviewMedia = $event"></app-media-picker>
          </div>
        </div>
        <div style="display:flex;gap:12px;margin-top:16px">
          <button mat-flat-button color="primary" type="submit" [disabled]="saving">
            <mat-spinner *ngIf="saving" diameter="20"></mat-spinner>
            <span *ngIf="!saving">{{ editItem ? 'Update' : 'Add' }}</span>
          </button>
          <button mat-button type="button" (click)="cancelForm()">Cancel</button>
        </div>
      </form>
    </div>
  `
})
export class ReviewsComponent implements OnInit {
  private svc = inject(MiscService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  items: ReviewResponse[] = [];
  cols = ['photo', 'name', 'rating', 'featured', 'actions'];
  loading = false;
  page = 0; pageSize = 10; total = 0;
  showForm = false; saving = false;
  editItem: ReviewResponse | null = null;
  reviewMedia: MediaResponse | null = null;

  form = this.fb.group({
    name: ['', Validators.required],
    designation: [''],
    rating: [null as number | null, [Validators.required, Validators.min(1), Validators.max(5)]],
    description: [''],
    isFeatured: [false]
  });

  ngOnInit() { this.load(); }

  load() {
    this.zone.run(() => {
      this.loading = true;
      this.cdr.markForCheck();
    });
    
    this.svc.getReviews(this.page, this.pageSize).subscribe({
      next: r => {
        this.zone.run(() => {
          this.items = r.data?.content || [];
          this.total = r.data?.totalElements || 0;
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

  onPage(e: PageEvent) { this.page = e.pageIndex; this.pageSize = e.pageSize; this.load(); }

  openForm(item?: ReviewResponse) {
    this.editItem = item || null; this.showForm = true;
    if (item) { this.form.patchValue({ name: item.name, designation: item.designation, rating: item.rating, description: item.description, isFeatured: item.isFeatured }); this.reviewMedia = item.media || null; }
    else { this.form.reset({ isFeatured: false }); this.reviewMedia = null; }
  }

  cancelForm() { this.showForm = false; this.editItem = null; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const req = { ...this.form.value, mediaId: this.reviewMedia?.id } as any;
    const obs = this.editItem ? this.svc.updateReview(this.editItem.id, req) : this.svc.createReview(req);
    obs.subscribe({
      next: () => { this.snack.open('Saved!', '', { duration: 2000 }); this.saving = false; this.cancelForm(); this.load(); },
      error: err => { this.saving = false; this.snack.open(err.error?.message || 'Error', '', { duration: 3000 }); }
    });
  }

  delete(row: ReviewResponse) {
    this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete', message: `Delete review by "${row.name}"?` } })
      .afterClosed().subscribe(ok => {
        if (!ok) return;
        this.svc.deleteReview(row.id).subscribe({ next: () => { this.snack.open('Deleted', '', { duration: 2000 }); this.load(); } });
      });
  }
}
