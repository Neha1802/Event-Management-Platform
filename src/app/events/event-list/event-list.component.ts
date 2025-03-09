import { Component, inject, OnInit } from '@angular/core';
import { EventServiceService, Event } from '../event-service.service';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {MatButtonModule} from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu'; 
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  imports: [CommonModule, ReactiveFormsModule, MatIconModule,
    MatButtonModule, MatMenuModule, MatCardModule],
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  private dialog = inject(MatDialog);

  constructor(private eventService: EventServiceService, private router: Router) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getEvents().subscribe(events => {
      this.events = events;
    });
  }

  onCreateEvent() {
    this.router.navigate(['/events/add-event']);
  }

  onEditEvent(event: Event) {
    this.router.navigate([`/events/${event.id}/edit`]);
  }

  // onDeleteEvent(eventId: number) {
  //   if (confirm('Are you sure you want to delete this event?')) {
  //     this.eventService.deleteEvent(eventId).subscribe(() => {
  //       this.loadEvents();
  //     });
  //   }
  // }

  onDeleteEvent(eventId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.eventService.deleteEvent(eventId).subscribe(() => {
          this.loadEvents();
        });
      }
    });
  }

  onViewDetails(eventId: number) {
    this.router.navigate(['/events', eventId]);
  }
}
