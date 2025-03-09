import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { EventServiceService, Event } from '../event-service.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatButtonModule, MatCardModule],
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent {
  private eventService = inject(EventServiceService);
  private route = inject(ActivatedRoute);

  event$: Observable<Event>;

  constructor() {
    const eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.event$ = this.eventService.getEvent(eventId);
  }
}
