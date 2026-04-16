import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  template: `
    <div class="modal-backdrop" *ngIf="visible" (click)="cancel()">
      <div class="modal" (click)="$event.stopPropagation()" style="max-width:420px">
        <div class="modal-header">
          <h3 class="modal-title">{{title}}</h3>
          <button class="btn-icon" (click)="cancel()">✕</button>
        </div>
        <div class="modal-body">
          <p style="color:var(--text-secondary);font-size:14px;">{{message}}</p>
        </div>
        <div class="modal-footer">
          <button class="btn btn-ghost" (click)="cancel()">Cancel</button>
          <button class="btn btn-danger" (click)="confirm()">{{confirmLabel}}</button>
        </div>
      </div>
    </div>
  `
})
export class ConfirmDialogComponent {
  @Input() visible = false;
  @Input() title = 'Confirm Action';
  @Input() message = 'Are you sure you want to proceed?';
  @Input() confirmLabel = 'Delete';
  @Output() confirmed = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  confirm() { this.confirmed.emit(); this.visible = false; }
  cancel()  { this.cancelled.emit(); this.visible = false; }
}
