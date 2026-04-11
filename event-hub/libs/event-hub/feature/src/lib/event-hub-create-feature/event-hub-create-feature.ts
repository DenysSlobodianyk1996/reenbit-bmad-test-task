import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EventDto, EventsService, EventType } from '@org/data';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { finalize } from 'rxjs';

@Component({
  selector: 'lib-event-hub-create-feature',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './event-hub-create-feature.html',
  styleUrl: './event-hub-create-feature.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EventHubCreateFeature {
  private fb = inject(FormBuilder);
  private eventsService = inject(EventsService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  title = input<string>('');
  isSubmitting = false;
  
  form = this.fb.group({
    userId: ['', Validators.required],
    type: ['', Validators.required],
    description: ['', Validators.required]
  });

  eventTypes = [
    { value: EventType.PageView, label: 'Page View' },
    { value: EventType.Click, label: 'Click' },
    { value: EventType.Purchase, label: 'Purchase' }
  ];

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    
    const eventData = this.form.value as Omit<EventDto, 'id' | 'createdAt'>;
    
    this.eventsService.createEvent(eventData).pipe(finalize(() => {
      this.isSubmitting = false;
    })).subscribe({
      next: () => {
        this.snackBar.open('Event created successfully!', 'Close', { duration: 3000 });
        this.cancel();
      }
    });
  }

  resetForm(): void {
    this.form.reset();
  }

  cancel(): void {
    this.router.navigate(['/event-hub-feature/overview']);
  }
}