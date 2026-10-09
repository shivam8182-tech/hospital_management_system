import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { EntityType, HospitalEntity } from '../../models/entity.model';
import { EntityService } from '../../../core/services/entity.service';
import { CryptoService } from '../../../core/services/crypto.service';
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

  @Input({ required: true }) type!: EntityType;
  @Output() countChange = new EventEmitter<number>();

  rows: HospitalEntity[] = [];
  search = '';

  ngOnChanges(): void {
    this.load();
  }

  load(): void {
    this.service.getAll(this.type).subscribe(rows => {
      this.rows = rows;
      this.countChange.emit(rows.length);
    });
  }

  get filteredRows(): HospitalEntity[] {
    const term = this.search.toLowerCase().trim();
    if (!term) return this.rows;
    return this.rows.filter(row =>
      Object.values(row).some(value => String(value ?? '').toLowerCase().includes(term))
    );
  }

  token(row: HospitalEntity): string {
    return this.crypto.encrypt(JSON.stringify({ type: this.type, id: row.id }));
  }
}