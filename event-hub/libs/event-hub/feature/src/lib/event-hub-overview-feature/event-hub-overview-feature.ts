import { Component, inject, input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule } from '@angular/forms';
import { EventDto, EventQueryRequest, EventsService, EventType } from '@org/data';
import { BehaviorSubject, debounceTime, distinctUntilChanged, finalize, Subject, takeUntil } from 'rxjs';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatFormField, MatLabel, MatSelectModule } from '@angular/material/select';
import { AsyncPipe, DatePipe } from '@angular/common';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatChip} from '@angular/material/chips';


@Component({
  selector: 'lib-event-hub-overview-feature',
  imports: [
    DatePipe,
    MatChip,
    MatTableModule,
    MatPaginator,
    MatFormField,
    MatLabel,
    MatSelectModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './event-hub-overview-feature.html',
  styleUrl: './event-hub-overview-feature.css',
})
export class EventHubOverviewFeature implements OnInit, OnDestroy {
  title = input<string>('');
  private destroy$ = new Subject<void>();

  private fb = inject(FormBuilder);
  private eventsService = inject(EventsService);
  
  filterForm = this.fb.nonNullable.group<{
    userId: FormControl<string>,
    type: FormControl<string>,
  }>({
    userId: this.fb.nonNullable.control(''),
    type: this.fb.nonNullable.control('')
  });
  
  isLoading$ = new BehaviorSubject<boolean>(false);
  dataSource = new MatTableDataSource<EventDto>();
  displayedColumns = ['userId', 'type', 'description', 'createdAt'];
  
  // Pagination
  totalCount = 0;
  pageSize = 20;
  currentPage = 1;
  totalPages = 0;

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
        ? [this.filterForm.get('type')?.value as EventType] 
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
