---
story_id: "4.1"
epic: "Phase 4: Event List Feature"
title: "Create Event List Component with Filtering and Table"
status: "ready-for-dev"
created: "2026-04-10"
---

# Story 4.1: Create Event List Component with Filtering and Table

## User Story
As a user, I want to view a paginated list of events with filtering and sorting so that I can find specific events.

## Acceptance Criteria

### 4.1.1 Event List Component Created
- [ ] Generate component: `nx g @nx/angular:component event-list --project=event-hub-feature`
- [ ] Create in `libs/event-hub/feature/src/lib/event-list/`
- [ ] Add route in `app.routes.ts`: `{ path: 'events', component: EventListComponent }`

### 4.1.2 Filter Form Implemented
- [ ] Create Reactive Form with:
  - `userId` (FormControl) - text input
  - `type` (FormControl) - select dropdown with options: All, PageView, Click, Purchase
- [ ] Use `valueChanges` with `debounceTime(300)` and `distinctUntilChanged`
- [ ] Subscribe to changes and trigger API calls
- [ ] Add "Clear Filters" button to reset form

### 4.1.3 Material Table Implemented
- [ ] Use `MatTable` with `MatTableDataSource`:
  - Columns: `userId`, `type`, `description`, `createdAt`
  - Display formatted dates
  - Event type as chip or badge
- [ ] Add `MatPaginator` for pagination UI
- [ ] Add `MatSort` for sorting headers (optional, since server-side sorting)

### 4.1.4 Server-Side Integration
- [ ] On filter change:
  - Build `EventQueryRequest` from form values
  - Call `eventsService.queryEvents(request)`
  - Update table with response items
- [ ] On page change:
  - Update request with new page number
  - Re-fetch data from server
- [ ] On sort change:
  - Update request with sortBy and sortOrder
  - Re-fetch data from server

### 4.1.5 Loading State
- [ ] Add `isLoading$` BehaviorSubject
- [ ] Show `MatSpinner` while loading
- [ ] Hide table during loading
- [ ] Use `finalize` operator to reset loading state

### 4.1.6 Empty State
- [ ] Show message when no events found
- [ ] "No events match your filters" or "No events yet"

## Technical Requirements

### Component Structure
```typescript
@Component({
  selector: 'lib-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  
  filterForm = this.fb.group({
    userId: [''],
    type: ['']
  });
  
  isLoading$ = new BehaviorSubject<boolean>(false);
  dataSource = new MatTableDataSource<Event>();
  displayedColumns = ['userId', 'type', 'description', 'createdAt'];
  
  // Pagination
  totalCount = 0;
  pageSize = 20;
  currentPage = 1;
  totalPages = 0;

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService
  ) {}

  ngOnInit(): void {
    this.setupFilterSubscription();
    this.loadEvents();
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.currentPage = 1; // Reset to first page on filter change
      this.loadEvents();
    });
  }

  loadEvents(): void {
    this.isLoading$.next(true);
    
    const request: EventQueryRequest = {
      userId: this.filterForm.get('userId')?.value || undefined,
      types: this.filterForm.get('type')?.value 
        ? [this.filterForm.get('type')?.value] 
        : undefined,
      page: this.currentPage,
      pageSize: this.pageSize,
      sortBy: 'createdAt',
      sortOrder: 'desc'
    };

    this.eventsService.queryEvents(request).pipe(
      finalize(() => this.isLoading$.next(false)),
      takeUntil(this.destroy$)
    ).subscribe(response => {
      this.dataSource.data = response.items;
      this.totalCount = response.totalCount;
      this.totalPages = response.totalPages;
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.loadEvents();
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

### Template Structure
```html
<!-- Filter Form -->
<div class="filters">
  <mat-form-field>
    <mat-label>User ID</mat-label>
    <input matInput [formControl]="filterForm.get('userId')" placeholder="Filter by user">
  </mat-form-field>

  <mat-form-field>
    <mat-label>Event Type</mat-label>
    <mat-select [formControl]="filterForm.get('type')">
      <mat-option value="">All</mat-option>
      <mat-option value="PageView">Page View</mat-option>
      <mat-option value="Click">Click</mat-option>
      <mat-option value="Purchase">Purchase</mat-option>
    </mat-select>
  </mat-form-field>

  <button mat-button (click)="clearFilters()">Clear Filters</button>
</div>

<!-- Loading Spinner -->
<div *ngIf="isLoading$ | async" class="loading">
  <mat-spinner diameter="40"></mat-spinner>
</div>

<!-- Events Table -->
<ng-container *ngIf="!(isLoading$ | async)">
  <table mat-table [dataSource]="dataSource" class="events-table">
    
    <ng-container matColumnDef="userId">
      <th mat-header-cell *matHeaderCellDef>User ID</th>
      <td mat-cell *matCellDef="let event">{{event.userId}}</td>
    </ng-container>

    <ng-container matColumnDef="type">
      <th mat-header-cell *matHeaderCellDef>Type</th>
      <td mat-cell *matCellDef="let event">
        <mat-chip>{{event.type}}</mat-chip>
      </td>
    </ng-container>

    <ng-container matColumnDef="description">
      <th mat-header-cell *matHeaderCellDef>Description</th>
      <td mat-cell *matCellDef="let event">{{event.description}}</td>
    </ng-container>

    <ng-container matColumnDef="createdAt">
      <th mat-header-cell *matHeaderCellDef>Created At</th>
      <td mat-cell *matCellDef="let event">{{event.createdAt | date:'medium'}}</td>
    </ng-container>

    <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
    <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
  </table>

  <!-- Empty State -->
  <div *ngIf="dataSource.data.length === 0" class="empty-state">
    No events found. <a routerLink="/events/create">Create one?</a>
  </div>

  <!-- Paginator -->
  <mat-paginator [length]="totalCount"
                 [pageSize]="pageSize"
                 [pageSizeOptions]="[10, 20, 50]"
                 (page)="onPageChange($event)">
  </mat-paginator>
</ng-container>
```

### Styling (SCSS)
```scss
.filters {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: center;
}

.loading {
  display: flex;
  justify-content: center;
  padding: 40px;
}

.events-table {
  width: 100%;
}

.empty-state {
  text-align: center;
  padding: 40px;
  color: #666;
}
```

## Definition of Done
- [ ] Component created with route
- [ ] Filter form with debounced API calls
- [ ] Material table displaying events
- [ ] Server-side pagination working
- [ ] Loading state showing spinner
- [ ] Empty state handled
- [ ] "Clear Filters" button working
- [ ] No console errors
- [ ] Responsive layout

## Dependencies
- Story 3.1 (Angular Data Layer) must be complete
- Story 2.2 (Backend API) should be running

## Testing
1. Open `/events` route
2. Verify events load in table
3. Type in User ID filter - verify debounced API calls
4. Select Event Type - verify filtered results
5. Change page - verify server-side paging
6. Clear filters - verify reset

## Notes
- Use `async` pipe for loading state
- `debounceTime(300)` prevents excessive API calls
- Always reset to page 1 when filters change
- Date pipe formats ISO strings nicely
