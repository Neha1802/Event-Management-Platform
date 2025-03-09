import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EventServiceService } from '../event-service.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-event-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatCardModule, MatFormFieldModule,
    MatInputModule, MatButtonModule, MatDatepickerModule, MatNativeDateModule, RouterLink],
  templateUrl: './event-form.component.html',
  styleUrls: ['./event-form.component.scss'],
  providers: [DatePipe]
})
export class EventFormComponent {
  private eventService = inject(EventServiceService);
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  eventForm: FormGroup;
  eventId: number | null = null;
  isEditMode = false;
  isLoading = false;


  constructor(private toastr: ToastrService, private datePipe: DatePipe) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', Validators.required],
      location: ['', Validators.required]
    });

    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.isEditMode = !!this.eventId;

    if (this.isEditMode) {
      this.eventService.getEvent(this.eventId).subscribe(event => {
        this.eventForm.patchValue(event);
      });
    }
  }

  onSubmit() {
    if (this.eventForm.invalid) return;

    this.isLoading = true;
    const formData = { ...this.eventForm.value };
   
    formData.date = this.datePipe.transform(formData.date, 'yyyy-MM-dd');

    if (this.isEditMode) {
      this.eventService.updateEvent(this.eventId!, formData).subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/events/event-list']);
      },
        (error) => {
          this.toastr.error('Something went wrong. Please try again!');
        }
      );
    } else {
      this.eventService.createEvent(formData).subscribe(() => {
        this.isLoading = false;
        this.router.navigate(['/events/event-list']);
      },
        (error) => {
          this.toastr.error('Something went wrong. Please try again!');
        }
      );
    }
  }
}
