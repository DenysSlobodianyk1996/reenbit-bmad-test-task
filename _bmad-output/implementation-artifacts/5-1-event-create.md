---
story_id: "5.1"
epic: "Phase 5: Create Event Feature"
title: "Create Event Form Component"
status: "ready-for-dev"
created: "2026-04-10"
---

# Story 5.1: Create Event Form Component

## User Story
As a user, I want to create new events using a form so that I can track user actions.

## Acceptance Criteria

### 5.1.1 Event Create Component Created
- [ ] Generate component: `nx g @nx/angular:component event-create --project=event-hub-feature`
- [ ] Create in `libs/event-hub/feature/src/lib/event-create/`
- [ ] Add route: `{ path: 'events/create', component: EventCreateComponent }`
- [ ] Add "Create Event" link in shell navigation

### 5.1.2 Reactive Form Implemented
- [ ] Create form with fields:
  - `userId` (string) - Required, text input
  - `type` (EventType) - Required, select dropdown
  - `description` (string) - Required, textarea
- [ ] Add `Validators.required` to all fields
- [ ] Form should be invalid until all fields have values

### 5.1.3 Validation UI
- [ ] Show validation errors using `mat-error`:
  ```html
  <mat-error *ngIf="form.get('userId')?.hasError('required')">
    User ID is required
  </mat-error>
  ```
- [ ] Disable submit button when form is invalid
- [ ] Show field as invalid (red) when touched and invalid

### 5.1.4 Submit Implementation
- [ ] On submit:
  - Check form validity
  - Call `eventsService.createEvent(form.value)`
  - Show success message (snackbar)
  - Navigate to event list on success
  - Show error message on failure (handled by global handler)
  - Keep form values on error for retry

### 5.1.5 Loading State
- [ ] Add `isSubmitting` flag
- [ ] Show spinner on submit button while submitting
- [ ] Disable form controls during submission

### 5.1.6 Form Reset
- [ ] "Reset" button to clear form
- [ ] "Cancel" button to navigate back to list

## Technical Requirements

### Component Structure
```typescript
@Component({
  selector: 'lib-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent {
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

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  onSubmit(): void {
    if (this.form.invalid) return;

    this.isSubmitting = true;
    
    const eventData = this.form.value as Omit<Event, 'id' | 'createdAt'>;
    
    this.eventsService.createEvent(eventData).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.snackBar.open('Event created successfully!', 'Close', { duration: 3000 });
        this.router.navigate(['/events']);
      },
      error: () => {
        this.isSubmitting = false;
        // Error handled by GlobalErrorHandler
      }
    });
  }

  resetForm(): void {
    this.form.reset();
  }

  cancel(): void {
    this.router.navigate(['/events']);
  }
}
```

### Template Structure
```html
<h2>Create New Event</h2>

<form [formGroup]="form" (ngSubmit)="onSubmit()">
  
  <mat-form-field appearance="fill">
    <mat-label>User ID</mat-label>
    <input matInput formControlName="userId" placeholder="Enter user ID">
    <mat-error *ngIf="form.get('userId')?.hasError('required')">
      User ID is required
    </mat-error>
  </mat-form-field>

  <mat-form-field appearance="fill">
    <mat-label>Event Type</mat-label>
    <mat-select formControlName="type" placeholder="Select event type">
      <mat-option *ngFor="let type of eventTypes" [value]="type.value">
        {{type.label}}
      </mat-option>
    </mat-select>
    <mat-error *ngIf="form.get('type')?.hasError('required')">
      Event type is required
    </mat-error>
  </mat-form-field>

  <mat-form-field appearance="fill">
    <mat-label>Description</mat-label>
    <textarea matInput formControlName="description" 
              placeholder="Describe the event"
              rows="4"></textarea>
    <mat-error *ngIf="form.get('description')?.hasError('required')">
      Description is required
    </mat-error>
  </mat-form-field>

  <div class="actions">
    <button mat-raised-button color="primary" 
            type="submit"
            [disabled]="form.invalid || isSubmitting">
      <mat-spinner *ngIf="isSubmitting" diameter="20"></mat-spinner>
      <span *ngIf="!isSubmitting">Create Event</span>
    </button>
    
    <button mat-button type="button" (click)="resetForm()">
      Reset
    </button>
    
    <button mat-button type="button" (click)="cancel()">
      Cancel
    </button>
  </div>

</form>
```

### Styling (SCSS)
```scss
:host {
  display: block;
  max-width: 600px;
  margin: 24px auto;
  padding: 0 16px;
}

form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

mat-form-field {
  width: 100%;
}

.actions {
  display: flex;
  gap: 16px;
  margin-top: 24px;
  
  button[type="submit"] {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
```

## Definition of Done
- [ ] Component created with route
- [ ] Reactive form with all required fields
- [ ] Validation messages shown
- [ ] Submit button disabled when invalid
- [ ] Submit creates event via API
- [ ] Success message shown
- [ ] Navigation to list on success
- [ ] Reset and Cancel buttons working
- [ ] Loading state on submit
- [ ] No console errors

## Dependencies
- Story 3.1 (Angular Data Layer) must be complete
- Story 2.2 (Backend API) should be running
- Story 4.1 (Event List) for navigation back

## Testing
1. Open `/events/create` route
2. Try submit without filling - verify validation
3. Fill all fields - verify submit enabled
4. Submit - verify success message and navigation
5. Create event - verify appears in list

## Notes
- Server sets `id` and `createdAt`, don't send them
- Success snackbar shows for 3 seconds
- On error, form values remain for retry
- Use `Omit<Event, 'id' | 'createdAt'>` type for form value
