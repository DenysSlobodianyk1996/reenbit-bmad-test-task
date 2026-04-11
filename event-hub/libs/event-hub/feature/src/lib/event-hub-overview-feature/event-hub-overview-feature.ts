import { ChangeDetectorRef, Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { EventDto, EventQueryRequest, EventQueryResponse, EventsService, EventType } from '@org/data';
import { BehaviorSubject, debounceTime, distinctUntilChanged, finalize, first, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormField, MatLabel, MatSelectModule } from '@angular/material/select';
import { AsyncPipe, DatePipe } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChip} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import {Sort, MatSortModule} from '@angular/material/sort';

@Component({
  selector: 'lib-event-hub-overview-feature',
  imports: [
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    DatePipe,
    MatChip,
    MatTableModule,
    MatPaginator,
    MatFormField,
    MatLabel,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule
  ],
  templateUrl: './event-hub-overview-feature.html',
  styleUrl: './event-hub-overview-feature.css',
})
export class EventHubOverviewFeature implements OnInit, OnDestroy {
  title = input<string>('');
  private destroy$ = new Subject<void>();

  private fb = inject(FormBuilder);
  private eventsService = inject(EventsService);
  private router = inject(Router);
  private changeDetectorRef = inject(ChangeDetectorRef);
  
  filterForm = this.fb.nonNullable.group<{
    userId: FormControl<string>,
    type: FormControl<EventType | null>,
  }>({
    userId: this.fb.nonNullable.control(''),
    type: this.fb.control(null)
  });
  
  isLoading$ = new BehaviorSubject<boolean>(false);
  dataSource = new MatTableDataSource<EventDto>();
  displayedColumns = ['userId', 'type', 'description', 'createdAt'];
  
  // Sort
  sort: Sort | null= null;

  // Pagination
  totalCount = 0;
  pageSize = 20;
  currentPage = 1;
  totalPages = 0;

  ngOnInit(): void {
    this.setupFilterSubscription();
    this.loadEvents().subscribe();
  }

  private setupFilterSubscription(): void {
    this.filterForm.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => {
        this.currentPage = 1; // Reset to first page on filter change
        this.changeDetectorRef.markForCheck();
      }),
      switchMap(() => this.loadEvents()),
      takeUntil(this.destroy$)
    ).subscribe();
  }

  loadEvents(): Observable<EventQueryResponse> {
    this.isLoading$.next(true);
    
    const sortBy = this.sort?.active;
    const sortOrder = this.sort?.direction;

    const request: EventQueryRequest = {
      userId: this.filterForm.get('userId')?.value || undefined,
      types: this.filterForm.get('type')?.value 
        ? [this.filterForm.get('type')?.value as EventType] 
        : undefined,
      page: this.currentPage,
      pageSize: this.pageSize,
      sortBy,
      sortOrder
    };

    return this.eventsService.queryEvents(request).pipe(
      first(),
      tap(response => {
        this.dataSource.data = response.items;
        this.totalCount = response.totalCount;
        this.totalPages = response.totalPages;
      }),
      finalize(() => this.isLoading$.next(false))
    );
  }


  onSortChange(event: Sort): void {
    this.sort = event;
    this.changeDetectorRef.markForCheck();
    this.loadEvents().subscribe();
  }

  onPageChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.changeDetectorRef.markForCheck();
    this.loadEvents().subscribe();
  }

  clearFilters(): void {
    this.filterForm.reset();
  }

  createNewEvent(): void {
    this.router.navigateByUrl('/event-hub-feature/create');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
