import { Component, OnInit, inject, ChangeDetectorRef, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MiscService } from '../../core/services/misc.service';
import { StatisticResponse } from '../../core/models/misc.model';
import { ConfirmDialogComponent } from '../../admin/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-statistics',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule,
    MatTableModule, MatButtonModule, MatIconModule,
    MatFormFieldModule, MatInputModule, MatDialogModule,
    MatSnackBarModule, MatProgressSpinnerModule, MatTooltipModule
  ],
  template: `
    <div class="page-header">
      <h1>Statistics</h1>
      <button mat-flat-button color="primary" (click)="openForm()" [disabled]="items.length >= 3" 
              [matTooltip]="items.length >= 3 ? 'Delete a statistic to add another' : ''"
              matTooltipPosition="above">
        <mat-icon>add</mat-icon> Add Stat
      </button>
    </div>

    <div *ngIf="loading" style="display:flex;justify-content:center;padding:40px"><mat-spinner diameter="40"></mat-spinner></div>

    <div class="stats-grid" *ngIf="!loading">
      <div class="stat-card" *ngFor="let s of items">
        <div class="stat-icon green">
          <mat-icon>{{ s.icon || 'bar_chart' }}</mat-icon>
        </div>
        <div class="stat-info">
          <h3>{{ s.value }}</h3>
          <p>{{ s.label }}</p>
        </div>
        <div class="stat-actions">
          <button mat-icon-button (click)="openForm(s)"><mat-icon>edit</mat-icon></button>
          <button mat-icon-button color="warn" (click)="delete(s)"><mat-icon>delete</mat-icon></button>
        </div>
      </div>
    </div>

    <div class="card mt-24" *ngIf="showForm">
      <h3 style="margin-bottom:16px">{{ editItem ? 'Edit Statistic' : 'Add Statistic' }}</h3>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="form-grid">
          <mat-form-field appearance="outline">
            <mat-label>Label *</mat-label>
            <input matInput formControlName="label">
            <mat-error>Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Value *</mat-label>
            <input matInput formControlName="value" placeholder="e.g. 500+">
            <mat-error>Required</mat-error>
          </mat-form-field>
          <mat-form-field appearance="outline">
            <mat-label>Icon (Material)</mat-label>
            <input matInput formControlName="icon" placeholder="e.g. business">
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
  `,
  styles: [`
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 16px; }
    .stat-card { position: relative; }
    .stat-actions { position: absolute; top: 8px; right: 8px; display: flex; }
  `]
})
export class StatisticsComponent implements OnInit {
  private svc = inject(MiscService);
  private snack = inject(MatSnackBar);
  private dialog = inject(MatDialog);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);
  private zone = inject(NgZone);

  items: StatisticResponse[] = [];
  loading = false; showForm = false; saving = false;
  editItem: StatisticResponse | null = null;

  form = this.fb.group({
    label: ['', Validators.required],
    value: ['', Validators.required],
    icon: [''],
    displayOrder: [0]
  });

  ngOnInit() { this.load(); }

  load() {
    this.zone.run(() => {
      this.loading = true;
      this.cdr.markForCheck();
    });
    
    this.svc.getStatistics().subscribe({
      next: r => {
        this.zone.run(() => {
          this.items = r.data || [];
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

  openForm(item?: StatisticResponse) {
    this.editItem = item || null; this.showForm = true;
    if (item) this.form.patchValue({ label: item.label, value: item.value, icon: item.icon, displayOrder: item.displayOrder });
    else this.form.reset({ displayOrder: 0 });
  }

  cancelForm() { this.showForm = false; this.editItem = null; }

  submit() {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    const req = this.form.value as any;
    const obs = this.editItem ? this.svc.updateStatistic(this.editItem.id, req) : this.svc.createStatistic(req);
    obs.subscribe({
      next: () => { this.snack.open('Saved!', '', { duration: 2000 }); this.saving = false; this.cancelForm(); this.load(); },
      error: err => { this.saving = false; this.snack.open(err.error?.message || 'Error', '', { duration: 3000 }); }
    });
  }

  delete(row: StatisticResponse) {
    this.dialog.open(ConfirmDialogComponent, { data: { title: 'Delete', message: 'Delete this statistic?' } })
      .afterClosed().subscribe(ok => {
        if (!ok) return;
        this.svc.deleteStatistic(row.id).subscribe({ next: () => { this.snack.open('Deleted', '', { duration: 2000 }); this.load(); } });
      });
  }
}
