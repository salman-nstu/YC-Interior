import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatExpansionModule } from '@angular/material/expansion';
import { MiscService } from '../../core/services/misc.service';
import { FaqResponse } from '../../core/models/misc.model';
import { ConfirmDialogComponent } from '../../admin/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatPaginatorModule, MatExpansionModule
  ],
  template: `
    <div class="page-header">
      <h1>FAQs</h1>
      <button mat-flat-button color="primary" (click)="openForm()"><mat-icon>add</mat-icon> Add FAQ</button>
    </div>

    <div *ngIf="loading" style="display:flex;justify-content:center;padding:40px"><mat-spinner diameter="40"></mat-spinner></div>

    <mat-accordion *ngIf="!loading">
      <mat-expansion-panel *ngFor="let item of items">
        <mat-expansion-panel-header>
          <mat-panel-title>{{ item.question }}</mat-panel-title>
          <mat-panel-description>Order: {{ item.displayOrder }}</mat-panel-description>
        </mat-expansion-panel-header>
        <p style="color:var(--text-muted);margin-bottom:12px">{{ item.answer }}</p>
        <div style="display:flex;gap:8px">
          <button mat-stroked-button (click)="openForm(item)"><mat-icon>edit</mat-icon> Edit</button>
          <button mat-stroked-button color="warn" (click)="delete(item)"><mat-icon>delete</mat-icon> Delete</button>
        </div>
      </mat-expansion-panel>
    </mat-accordion>

    <mat-paginator [length]="total" [pageSize]="pageSize" [pageSizeOptions]="[10,25]" (page)="onPage($event)" style="margin-top:16px"></mat-paginator>

    <div class="card mt-24" *ngIf="showForm">
      <h3 style="margin-bottom:16px">{{ editItem ? 'Edit FAQ' : 'Add FAQ' }}</h3>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <mat-form-field appearance="outline" class="form-full">
            <mat-label>Question *</mat-label>
            <input matInput formControlName="question">
            <mat-error>Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline" class="form-full">
            <mat-label>Answer *</mat-label>
            <textarea matInput formControlName="answer" rows="4"></textarea>
            <mat-error>Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Display Order</mat-label>
            <input matInput type="number" formControlName="displayOrder" min="0" step="1">
          </mat-form-field>
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
export class FaqsComponent implements OnInit {
  private svc = inject(MiscService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  items: FaqResponse[] = [];
  loading = false;
  page = 0; pageSize = 10; total = 0;
  showForm = false; saving = false;
  editItem: FaqResponse | null = null;

  form = this.fb.group({
    question: ['', Validators.required],
    answer: ['', Validators.required],
    displayOrder: [0]
  });

  ngOnInit() { this.load(); }

  load() {
    this.zone.run(() => {
      this.loading = true;
      this.cdr.markForCheck();
    });
    
    this.svc.getFaqs(undefined, this.page, this.pageSize).subscribe({
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

  openForm(item?: FaqResponse) {
    this.editItem = item || null; this.showForm = true;
    if (item) this.form.patchValue({ question: item.question, answer: item.answer, displayOrder: item.displayOrder });
    else this.form.reset({ displayOrder: 0 });
  }

  cancelForm() { this.showForm = false; this.editItem = null; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const req = this.form.value as any;
    const obs = this.editItem ? this.svc.updateFaq(this.editItem.id, req) : this.svc.createFaq(req);
    obs.subscribe({
      next: () => { this.snack.open('Saved!', '', { duration: 2000 }); this.saving = false; this.cancelForm(); this.load(); },
      error: err => { this.saving = false; this.snack.open(err.error?.message || 'Error', '', { duration: 3000 }); }
    });
  }

  delete(row: FaqResponse) {
    this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete FAQ', message: 'Delete this FAQ?' } })
      .afterClosed().subscribe(ok => {
        if (!ok) return;
        this.svc.deleteFaq(row.id).subscribe({ next: () => { this.snack.open('Deleted', '', { duration: 2000 }); this.load(); } });
      });
  }
}
