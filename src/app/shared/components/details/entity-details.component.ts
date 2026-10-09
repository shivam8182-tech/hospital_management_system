import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CryptoService } from '../../../core/services/crypto.service';
import { EntityService } from '../../../core/services/entity.service';
import { EntityType, HospitalEntity } from '../../models/entity.model';
import { StatusLabelPipe } from '../../pipes/status.pipe';

@Component({
  selector: 'app-entity-details',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusLabelPipe],
  templateUrl: './entity-details.component.html',
  styleUrl: './entity-details.component.css'
})
export class EntityDetailsComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly crypto = inject(CryptoService);
  private readonly service = inject(EntityService);

  entity?: HospitalEntity;
  type?: EntityType;
  error = '';

  ngOnInit(): void {
    const token = this.route.snapshot.paramMap.get('token');
    if (!token) {
      this.error = 'Invalid record token.';
      return;
    }

    const payload = this.crypto.decrypt(token);
    if (!payload) {
      this.error = 'Unable to open this record.';
      return;
    }

    try {
      const data = JSON.parse(payload) as { type: EntityType; id: string };
      if (!['patient', 'staff', 'provider', 'biller'].includes(data.type)) {
        this.error = 'Invalid entity type.';
        return;
      }
      this.type = data.type;
      this.service.getById(data.type, data.id).subscribe(entity => {
        this.entity = entity;
        if (!entity) this.error = 'Record not found.';
      });
    } catch {
      this.error = 'Invalid record token.';
    }
  }
}