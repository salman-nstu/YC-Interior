import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  template: `
    <div class="pagination" *ngIf="totalPages > 1">
      <button (click)="emit(0)" [disabled]="currentPage === 0">«</button>
      <button (click)="emit(currentPage - 1)" [disabled]="currentPage === 0">‹</button>
      <button *ngFor="let p of pages" [class.active]="p === currentPage" (click)="emit(p)">{{p + 1}}</button>
      <button (click)="emit(currentPage + 1)" [disabled]="currentPage >= totalPages - 1">›</button>
      <button (click)="emit(totalPages - 1)" [disabled]="currentPage >= totalPages - 1">»</button>
    </div>
  `
})
export class PaginationComponent {
  @Input() totalPages = 0;
  @Input() currentPage = 0;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    const start = Math.max(0, this.currentPage - 2);
    const end = Math.min(this.totalPages, start + 5);
    return Array.from({ length: end - start }, (_, i) => start + i);
  }

  emit(p: number) {
    if (p >= 0 && p < this.totalPages) this.pageChange.emit(p);
  }
}
