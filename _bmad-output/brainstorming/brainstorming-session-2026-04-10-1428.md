---
stepsCompleted: [1, 2]
inputDocuments: []
session_topic: 'Setting up an Nx monorepo workspace with Angular + ASP.NET Core Web API'
session_goals: 'Explore architectural decisions, project structure, integration patterns, development workflow, and implementation strategies for Event-Hub workspace'
selected_approach: 'ai-recommended'
techniques_used: ['First Principles Thinking', 'SCAMPER Method', 'Analogical Thinking', 'Mind Mapping']
ideas_generated: 15
context_file: ''
---

# Brainstorming Session Results

**Facilitator:** Denysslobodianyk
**Date:** 2026-04-10

## Session Overview

**Topic:** Setting up an Nx monorepo workspace with Angular + ASP.NET Core Web API
**Goals:** Explore architectural decisions, project structure, integration patterns, development workflow, and implementation strategies for Event-Hub workspace

### Session Setup

**Project Details:**
- **Workspace Name:** Event-Hub
- **Frontend (Event-Hub-FE):** Angular 21 webapp
  - Events table with filtering, sorting, paging
  - Create Event page using ReactiveForms
  - API integration for data fetching and event creation
- **Backend (Event-Hub-BE):** .NET Web API
  - `POST /api/events` — create new event
  - `GET /api/events` — retrieve events with query parameters for filtering, sorting, paging
  - Database: SQLite or JSON file for persistence
- **Event Model:** Id (GUID), UserId (string), Type (PageView/Click/Purchase), Description (string), CreatedAt (DateTime)

## Technique Selection

**Approach:** AI-Recommended Techniques
**Analysis Context:** Setting up an Nx monorepo workspace with Angular + ASP.NET Core Web API with focus on architectural decisions, project structure, and implementation strategies

**Recommended Techniques:**

1. **First Principles Thinking** — Strip away assumptions to rebuild from fundamental truths about what Event-Hub actually needs to do. Avoid cargo-cult architecture and build only what's truly required.

2. **SCAMPER Method** — Systematically apply 7 lenses (Substitute, Combine, Adapt, Modify, Put to other uses, Eliminate, Reverse) to each component for thorough exploration of alternatives.

3. **Analogical Thinking** — Draw parallels from other domains (analytics dashboards, event sourcing systems, audit logging) to borrow proven patterns for event storage, querying, and visualization.

4. **Mind Mapping** — Visually organize all explored ideas into a coherent project structure with clear dependencies between Angular and .NET projects, API contracts, database schema, and component relationships.

**AI Rationale:** Technical architecture benefits from structured exploration. Starting with fundamentals (First Principles), systematically varying components (SCAMPER), borrowing proven patterns (Analogical), and synthesizing into a visual blueprint (Mind Mapping) ensures comprehensive coverage while maintaining focus on implementation-ready outcomes.

## Technique Execution Results

### Brainstorming Session: Event-Hub Architecture Decisions

**Session Type:** Focused Implementation Brainstorm for Test Task  
**Session Date:** 2026-04-10  
**Facilitator:** AI + Denysslobodianyk (collaborative)

---

### Summary of Key Decisions

#### 1. Nx Workspace Structure
**Decision:** Option B — Nx manages Angular FE, .NET BE runs independently  
**Rationale:** Simplicity and reliability for test task. No custom Nx executor needed.

**Folder Structure:**
```
apps/
├── Event-Hub-FE/          # Angular SPA (Nx-managed)
├── Event-Hub-BE/          # .NET Web API (dotnet CLI)
libs/
├── event-hub/feature/     # UI components, pages
├── event-hub/data/        # API services
├── event-hub-shell/       # Layout, navigation
```

**Development Workflow:**
```bash
# Terminal 1
cd apps/Event-Hub-BE && dotnet run

# Terminal 2
nx serve Event-Hub-FE
```

---

#### 2. Angular Architecture — Shell Pattern
**Decision:** Feature/Data libs with shell for layout  
**Rationale:** Follows enterprise Angular patterns, clean separation of concerns.

**Event Model:**
```typescript
interface Event {
  id: string;           // GUID
  userId: string;
  type: 'PageView' | 'Click' | 'Purchase';
  description: string;
  createdAt: DateTime;
}
```

---

#### 3. .NET API Design
**Decision:** POST `/api/events/query` with request body for filtering/sorting/paging  
**Rationale:** Clean JSON structure, no URL length limits, easy to extend.

**Endpoints:**
- `POST /api/events` — Create new event
- `POST /api/events/query` — Query with filters, sorting, paging

**Request Body Structure:**
```json
{
  "userId": "string",
  "types": ["PageView", "Click"],
  "sortBy": "createdAt",
  "sortOrder": "desc",
  "page": 1,
  "pageSize": 20
}
```

---

#### 4. Database Choice
**Decision:** SQLite with EF Core  
**Rationale:** Production-like patterns, proper querying, demonstrates professional skills.

**EF Core Setup:**
```csharp
builder.Services.AddDbContext<EventHubDbContext>(options =>
    options.UseSqlite("Data Source=eventhub.db"));
```

**Auto-creation:** Database should be created automatically if not exists.

---

#### 5. Angular Table Implementation
**Decision:** Angular Material Table with server-side data  
**Rationale:** Shows standard Angular patterns, quick to implement, looks polished.

**Features:**
- `MatTableDataSource` for display
- `MatPaginator` for paging UI
- Server-side filtering, sorting, paging via API

---

#### 6. Filtering UI
**Decision:** Reactive Form with debounced valueChanges  
**Rationale:** Clean reactive pattern, professional UX, minimal code.

**Implementation:**
```typescript
this.filterForm.valueChanges.pipe(
  debounceTime(300),
  distinctUntilChanged(),
  switchMap(filters => this.eventsService.query(filters))
).subscribe(events => this.dataSource.data = events);
```

---

#### 7. Error Handling Strategy
**Decision:** Global handler on FE, middleware on BE  
**Rationale:** Clean separation, one place for errors on each side.

**Angular:**
- `GlobalErrorHandler` implements `ErrorHandler`
- Shows Material Snackbar for user notifications
- Logs to console

**.NET:**
- Exception handler middleware
- Returns 4xx/5xx with JSON error body
- FE receives error, logs, shows toast

---

#### 8. Loading States
**Decision:** Simple `isLoading$` flag with `mat-spinner`  
**Rationale:** Clear feedback to user during API calls.

**Implementation:**
```typescript
isLoading$ = new BehaviorSubject<boolean>(false);
loadEvents() {
  this.isLoading$.next(true);
  this.eventsService.query(filters).pipe(
    finalize(() => this.isLoading$.next(false))
  ).subscribe(...);
}
```

---

#### 9. CORS Configuration
**Decision:** Allow `localhost:4200` for local development  
**Rationale:** Angular dev server runs on port 4200, .NET on different port.

**.NET CORS Setup:**
```csharp
builder.Services.AddCors(options => {
    options.AddPolicy("AllowAngular", policy => {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});
app.UseCors("AllowAngular");
```

---

#### 10. Form Validation
**Decision:** All fields required on create event form  
**Rationale:** Simple, clear requirement.

**Implementation:**
```typescript
createEventForm = this.fb.group({
  userId: ['', Validators.required],
  type: ['', Validators.required],
  description: ['', Validators.required]
});
```

---

#### 11. Gitignore Rules
**Decision:** SQLite database file should be gitignored  
**Rationale:** Database is auto-created, should not be in repo.

**Add to `.gitignore`:**
```
# SQLite Database
*.db
*.db-journal
apps/Event-Hub-BE/*.db
```

---

### Final Architecture Overview

```
Event-Hub (Nx Workspace)
├── apps/
│   ├── Event-Hub-FE/              # Angular 21
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── events/
│   │   │   │   │   ├── event-list/
│   │   │   │   │   └── event-create/
│   │   │   │   ├── core/
│   │   │   │   │   └── error-handler/
│   │   │   │   └── app.component.ts
│   │   │   └── main.ts
│   │   └── project.json
│   └── Event-Hub-BE/              # .NET Web API
│       ├── Controllers/
│       │   └── EventsController.cs
│       ├── Models/
│       │   ├── Event.cs
│       │   └── EventQueryRequest.cs
│       ├── Data/
│       │   └── EventHubDbContext.cs
│       ├── Program.cs
│       └── EventHubBE.csproj
├── libs/
│   └── event-hub/
│       ├── feature/               # UI components
│       ├── data/                  # API services
│       └── shell/                 # Layout
└── package.json
```

---

### Creative Facilitation Narrative

This brainstorming session was a focused, practical exploration of architectural decisions for a test task. Rather than open-ended ideation, we moved through specific implementation choices efficiently:

1. **Started with fundamentals** — clarified this was a test task with clear requirements
2. **Moved through decisions systematically** — workspace structure, API design, database, UI patterns
3. **Kept focus on practicality** — choices optimized for test task success, not over-engineering
4. **Collaborative decision-making** — user had clear preferences that shaped recommendations

**User Strengths Demonstrated:**
- Clear understanding of requirements
- Pragmatic decision-making (Option B for simplicity)
- Awareness of professional patterns (Reactive Forms, error handling)
- Focus on deliverable outcomes

---

### Session Highlights

**Total Ideas Generated:** 15 architectural decisions  
**Key Breakthroughs:** Clear separation of concerns, server-side filtering approach, minimal error handling  
**Session Duration:** ~15 minutes  
**Energy Level:** Focused, practical, outcome-oriented  

**Next Steps:** Move to implementation planning and execution.
