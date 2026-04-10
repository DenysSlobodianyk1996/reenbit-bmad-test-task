---
story_id: "2.1"
epic: "Phase 2: Backend Implementation"
title: "Create Database Models and DbContext"
status: "ready-for-dev"
created: "2026-04-10"
---

# Story 2.1: Create Database Models and DbContext

## User Story
As a developer, I want to create the database models and EF Core context so that the Event-Hub API can persist and retrieve event data.

## Acceptance Criteria

### 2.1.1 Event Model Created
- [ ] Create `Models/Event.cs` with properties:
  - `Id` (Guid) - Primary key, auto-generated
  - `UserId` (string) - Required, max length 255
  - `Type` (EventType enum) - Required
  - `Description` (string) - Required, max length 1000
  - `CreatedAt` (DateTime) - Required, auto-set to UTC now

### 2.1.2 EventType Enum Created
- [ ] Create `Models/EventType.cs` with values:
  - PageView = 0
  - Click = 1
  - Purchase = 2

### 2.1.3 EventQueryRequest Model Created
- [ ] Create `Models/EventQueryRequest.cs` with properties:
  - `UserId` (string?) - Optional filter
  - `Types` (List<EventType>?) - Optional filter by event types
  - `SortBy` (string) - "CreatedAt" or "UserId" or "Type"
  - `SortOrder` (string) - "asc" or "desc"
  - `Page` (int) - Page number (1-based)
  - `PageSize` (int) - Items per page (default 20, max 100)

### 2.1.4 EventQueryResponse Model Created
- [ ] Create `Models/EventQueryResponse.cs` with properties:
  - `Items` (List<Event>) - Event items for current page
  - `TotalCount` (int) - Total items matching filter
  - `Page` (int) - Current page number
  - `PageSize` (int) - Items per page
  - `TotalPages` (int) - Calculated: ceil(TotalCount / PageSize)

### 2.1.5 DbContext Created
- [ ] Create `Data/EventHubDbContext.cs`:
  - Inherit from `DbContext`
  - Add `DbSet<Event> Events` property
  - Configure `Event` entity in `OnModelCreating`
  - Set auto-generated GUID for Id

### 2.1.6 DbContext Registered
- [ ] In `Program.cs`, register DbContext:
  ```csharp
  builder.Services.AddDbContext<EventHubDbContext>(options =>
      options.UseSqlite("Data Source=eventhub.db"));
  ```

### 2.1.7 Auto-Database Creation
- [ ] Ensure database is created on startup:
  ```csharp
  using (var scope = app.Services.CreateScope())
  {
      var db = scope.ServiceProvider.GetRequiredService<EventHubDbContext>();
      db.Database.EnsureCreated();
  }
  ```
- [ ] SQLite file should auto-create if not exists
- [ ] `.db` files should be in `.gitignore`

## Technical Requirements

### Event.cs
```csharp
namespace Event_Hub_BE.Models;

public class Event
{
    public Guid Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public EventType Type { get; set; }
    public string Description { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

### EventType.cs
```csharp
namespace Event_Hub_BE.Models;

public enum EventType
{
    PageView,
    Click,
    Purchase
}
```

### EventHubDbContext.cs
```csharp
using Microsoft.EntityFrameworkCore;
using Event_Hub_BE.Models;

namespace Event_Hub_BE.Data;

public class EventHubDbContext : DbContext
{
    public EventHubDbContext(DbContextOptions<EventHubDbContext> options) 
        : base(options) { }

    public DbSet<Event> Events => Set<Event>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Event>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.UserId).IsRequired().HasMaxLength(255);
            entity.Property(e => e.Description).IsRequired().HasMaxLength(1000);
            entity.Property(e => e.Type).IsRequired();
            entity.Property(e => e.CreatedAt).IsRequired();
        });
    }
}
```

## File Structure
```
apps/Event-Hub-BE/
├── Models/
│   ├── Event.cs
│   ├── EventType.cs
│   ├── EventQueryRequest.cs
│   └── EventQueryResponse.cs
├── Data/
│   └── EventHubDbContext.cs
└── Program.cs (updated)
```

## Definition of Done
- [ ] All models created with proper types
- [ ] DbContext configured with entity mapping
- [ ] Database auto-creates on startup
- [ ] SQLite file in `.gitignore`
- [ ] No build errors
- [ ] Test: Create and retrieve event in database

## Dependencies
- Story 1.1 (Nx Workspace Init) must be complete
- Entity Framework Core SQLite package installed

## Notes
- Keep models simple, no complex relationships needed
- EventType as enum maps to integer in SQLite
- CreatedAt defaults to UtcNow
