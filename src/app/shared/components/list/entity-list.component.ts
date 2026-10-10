import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EntityType, HospitalEntity } from '../../models/entity.model';
import { EntityService } from '../../../core/services/entity.service';
import { CryptoService } from '../../../core/services/crypto.service';
import { ToastService } from '../../../core/services/toast.service';
import { StatusLabelPipe } from '../../pipes/status.pipe';
// import { UsPhoneFormatDirective } from '../../directives/phone-format.directive';

@Component({
  selector: 'app-entity-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, StatusLabelPipe],
  templateUrl: './entity-list.component.html',
  styleUrl: './entity-list.component.css'
})
export class EntityListComponent {
  private readonly service = inject(EntityService);
  private readonly crypto = inject(CryptoService);
  private readonly toast = inject(ToastService);

  @Input({ required: true }) type!: EntityType;
  @Output() countChange = new EventEmitter<number>();

  rows: HospitalEntity[] = [];
  search = '';
  currentPage = 1;
  pageSize = 10;
  private readonly tokenCache = new Map<string, string>();

  ngOnChanges(): void {
    this.load();
  }

  load(): void {
    try {
      this.service.getAll(this.type).subscribe({
        next: rows => {
          this.rows = rows;
          this.currentPage = 1;
          this.countChange.emit(rows.length);
        },
        error: error => this.reportLoadError(error)
      });
    } catch (error) {
      this.reportLoadError(error);
    }
  }

  get filteredRows(): HospitalEntity[] {
    const term = this.search.toLowerCase().trim();
    if (!term) return this.rows;
    return this.rows.filter(row =>
      Object.values(row).some(value => String(value ?? '').toLowerCase().includes(term))
    );
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.filteredRows.length / this.pageSize));
  }

  get pageRows(): HospitalEntity[] {
    const start = (this.currentPage - 1) * this.pageSize;
    return this.filteredRows.slice(start, start + this.pageSize);
  }

  get firstVisibleRow(): number {
    return this.filteredRows.length === 0 ? 0 : (this.currentPage - 1) * this.pageSize + 1;
  }

  get lastVisibleRow(): number {
    return Math.min(this.currentPage * this.pageSize, this.filteredRows.length);
  }

  onSearchChange(): void {
    this.currentPage = 1;
  }

  onPageSizeChange(): void {
    this.currentPage = 1;
  }

  goToPage(page: number): void {
    this.currentPage = Math.min(Math.max(page, 1), this.totalPages);
  }

  token(row: HospitalEntity): string {
    const key = `${this.type}:${row.id}`;
    const cached = this.tokenCache.get(key);
    if (cached) return cached;

    const token = this.crypto.encrypt(JSON.stringify({ type: this.type, id: row.id }));
    this.tokenCache.set(key, token);
    return token;
  }

  private reportLoadError(error: unknown): void {
    console.error(`Failed to load ${this.type} records:`, error);
    this.toast.error(error instanceof Error ? error.message : `Unable to load ${this.type} records.`);
  }
}