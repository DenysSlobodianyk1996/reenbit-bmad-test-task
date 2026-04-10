---
story_id: "3.1"
epic: "Phase 3: Frontend Data Layer"
title: "Create Angular Models, Services, and Error Handling"
status: "ready-for-dev"
created: "2026-04-10"
---

# Story 3.1: Create Angular Models, Services, and Error Handling

## User Story
As a developer, I want to create the Angular models, HTTP services, and global error handling so that the frontend can communicate with the backend API.

## Acceptance Criteria

### 3.1.1 Event Models Created
- [ ] Create `libs/event-hub/data/src/lib/models/event.model.ts`:
  ```typescript
  export interface Event {
    id: string;
    userId: string;
    type: EventType;
    description: string;
    createdAt: string;
  }

  export enum EventType {
    PageView = 'PageView',
    Click = 'Click',
    Purchase = 'Purchase'
  }
  ```

### 3.1.2 EventQuery Models Created
- [ ] Create `event-query-request.model.ts`:
  ```typescript
  export interface EventQueryRequest {
    userId?: string;
    types?: EventType[];
    sortBy?: 'createdAt' | 'userId' | 'type';
    sortOrder?: 'asc' | 'desc';
    page: number;
    pageSize: number;
  }
  ```
- [ ] Create `event-query-response.model.ts`:
  ```typescript
  export interface EventQueryResponse {
    items: Event[];
    totalCount: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }
  ```

### 3.1.3 Events Service Created
- [ ] Create `libs/event-hub/data/src/lib/services/events.service.ts`:
  - Inject `HttpClient`
  - Base URL from environment
  - `createEvent(event: Omit<Event, 'id' | 'createdAt'>)` → POST `/api/events`
  - `queryEvents(request: EventQueryRequest)` → POST `/api/events/query`

### 3.1.4 Environment Configuration
- [ ] Create `apps/Event-Hub-FE/src/environments/environment.ts`:
  ```typescript
  export const environment = {
    production: false,
    apiUrl: 'http://localhost:5000'
  };
  ```
- [ ] Create `environment.prod.ts`:
  ```typescript
  export const environment = {
    production: true,
    apiUrl: '/api'
  };
  ```

### 3.1.5 Global Error Handler Created
- [ ] Create `apps/Event-Hub-FE/src/app/core/error-handler/global-error.handler.ts`:
  - Implement `ErrorHandler` interface
  - Inject `MatSnackBar`
  - Show toast notification on error
  - Log to console
  ```typescript
  @Injectable()
  export class GlobalErrorHandler implements ErrorHandler {
    constructor(private snackBar: MatSnackBar) {}

    handleError(error: any): void {
      console.error('Error:', error);
      const message = error.message || 'An unexpected error occurred';
      this.snackBar.open(message, 'Close', { duration: 5000 });
    }
  }
  ```

### 3.1.6 Error Handler Registered
- [ ] Update `app.config.ts`:
  ```typescript
  providers: [
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideHttpClient(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler }
  ]
  ```

## Technical Requirements

### Service Implementation
```typescript
@Injectable({ providedIn: 'root' })
export class EventsService {
  private apiUrl = `${environment.apiUrl}/api/events`;

  constructor(private http: HttpClient) {}

  createEvent(event: Omit<Event, 'id' | 'createdAt'>): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, event);
  }

  queryEvents(request: EventQueryRequest): Observable<EventQueryResponse> {
    return this.http.post<EventQueryResponse>(`${this.apiUrl}/query`, request);
  }
}
```

### File Structure
```
libs/event-hub/data/src/lib/
├── models/
│   ├── event.model.ts
│   ├── event-query-request.model.ts
│   └── event-query-response.model.ts
└── services/
    └── events.service.ts

apps/Event-Hub-FE/src/
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── app/core/
    └── error-handler/
        └── global-error.handler.ts
```

### Module Exports
Update `libs/event-hub/data/src/index.ts`:
```typescript
export * from './lib/models/event.model';
export * from './lib/models/event-query-request.model';
export * from './lib/models/event-query-response.model';
export * from './lib/services/events.service';
```

## Definition of Done
- [ ] All models created with proper types
- [ ] Events service with create and query methods
- [ ] Environment configuration for dev/prod
- [ ] Global error handler showing Material Snackbar
- [ ] Error handler registered in app config
- [ ] Service tested with simple call
- [ ] No build errors

## Dependencies
- Story 1.1 (Nx Workspace) must be complete
- Story 2.2 (Backend API) should be running

## Testing
```typescript
// In component or console
constructor(private eventsService: EventsService) {
  // Test query
  this.eventsService.queryEvents({ page: 1, pageSize: 10 })
    .subscribe(console.log);
}
```

## Notes
- Use `Omit<Event, 'id' | 'createdAt'>` for create payload (server sets these)
- Dates come as ISO strings from API, can be parsed to Date if needed
- Snackbar duration 5000ms = 5 seconds
