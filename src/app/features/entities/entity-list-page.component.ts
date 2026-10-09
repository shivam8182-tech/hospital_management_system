import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { EntityListComponent } from '../../shared/components/list/entity-list.component';
import { EntityType } from '../../shared/models/entity.model';

@Component({
  selector: 'app-entity-list-page',
  standalone: true,
  imports: [EntityListComponent, RouterLink],
  templateUrl: './entity-list-page.component.html',
  styleUrl: './entity-list-page.component.css'
})
export class EntityListPageComponent {
  private readonly route = inject(ActivatedRoute);
  type: EntityType = 'patient';

  ngOnInit(): void {
    this.route.url.subscribe(segments => {
      const value = segments[0]?.path as EntityType | undefined;
      if (value && ['patient', 'staff', 'provider', 'biller'].includes(value)) {
        this.type = value;
      }
    });
  }

  title(): string {
    return this.type.charAt(0).toUpperCase() + this.type.slice(1) + ' List';
  }
}