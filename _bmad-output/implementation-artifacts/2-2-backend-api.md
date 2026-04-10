---
story_id: "2.2"
epic: "Phase 2: Backend Implementation"
title: "Create Events Controller with API Endpoints"
status: "ready-for-dev"
created: "2026-04-10"
---

# Story 2.2: Create Events Controller with API Endpoints

## User Story
As a developer, I want to create the Events controller with POST and query endpoints so that the frontend can create events and retrieve them with filtering, sorting, and pagination.

## Acceptance Criteria

### 2.2.1 Events Controller Created
- [ ] Create `Controllers/EventsController.cs`
- [ ] Inherit from `ControllerBase`
- [ ] Add `[ApiController]` and `[Route("api/[controller]")]` attributes
- [ ] Inject `EventHubDbContext` via constructor

### 2.2.2 Create Event Endpoint
- [ ] Implement `POST /api/events`:
  - Accept `Event` in request body
  - Set `Id` to new GUID
  - Set `CreatedAt` to `DateTime.UtcNow`
  - Save to database
  - Return 201 Created with the created event
  - Return 400 Bad Request if validation fails

### 2.2.3 Query Events Endpoint
- [ ] Implement `POST /api/events/query`:
  - Accept `EventQueryRequest` in body
  - Build queryable from `Events` DbSet
  - Apply filtering by `UserId` if provided
  - Apply filtering by `Types` if provided
  - Apply sorting by `SortBy` and `SortOrder`
  - Get total count before paging
  - Apply `Skip((Page-1) * PageSize)` and `Take(PageSize)`
  - Return `EventQueryResponse` with items and metadata

### 2.2.4 Server-Side Filtering
- [ ] Filter by `UserId`:
  ```csharp
  if (!string.IsNullOrEmpty(request.UserId))
      query = query.Where(e => e.UserId.Contains(request.UserId));
  ```
- [ ] Filter by `Types`:
  ```csharp
  if (request.Types?.Any() == true)
      query = query.Where(e => request.Types.Contains(e.Type));
  ```

### 2.2.5 Server-Side Sorting
- [ ] Support sorting by `CreatedAt`, `UserId`, `Type`
- [ ] Support `asc` and `desc` order
- [ ] Default sort: `CreatedAt desc`
- [ ] Use switch expression or if-else for dynamic sorting

### 2.2.6 Server-Side Pagination
- [ ] Validate `Page` >= 1, default to 1
- [ ] Validate `PageSize` between 1 and 100, default to 20
- [ ] Calculate `TotalPages` = `(TotalCount + PageSize - 1) / PageSize`
- [ ] Return current page, page size, total count, total pages

## Technical Requirements

### EventsController.cs Structure
```csharp
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Event_Hub_BE.Data;
using Event_Hub_BE.Models;

namespace Event_Hub_BE.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EventsController : ControllerBase
{
    private readonly EventHubDbContext _context;

    public EventsController(EventHubDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<ActionResult<Event>> CreateEvent([FromBody] Event event)
    {
        // Implementation
    }

    [HttpPost("query")]
    public async Task<ActionResult<EventQueryResponse>> QueryEvents([FromBody] EventQueryRequest request)
    {
        // Implementation
    }
}
```

### Create Event Logic
```csharp
[HttpPost]
public async Task<ActionResult<Event>> CreateEvent([FromBody] Event event)
{
    if (!ModelState.IsValid)
        return BadRequest(ModelState);

    event.Id = Guid.NewGuid();
    event.CreatedAt = DateTime.UtcNow;

    _context.Events.Add(event);
    await _context.SaveChangesAsync();

    return CreatedAtAction(nameof(CreateEvent), new { id = event.Id }, event);
}
```

### Query Events Logic
```csharp
[HttpPost("query")]
public async Task<ActionResult<EventQueryResponse>> QueryEvents([FromBody] EventQueryRequest request)
{
    var query = _context.Events.AsQueryable();

    // Filtering
    if (!string.IsNullOrEmpty(request.UserId))
        query = query.Where(e => e.UserId.Contains(request.UserId));

    if (request.Types?.Any() == true)
        query = query.Where(e => request.Types.Contains(e.Type));

    // Sorting
    query = request.SortBy?.ToLower() switch
    {
        "userid" => request.SortOrder == "asc" 
            ? query.OrderBy(e => e.UserId) 
            : query.OrderByDescending(e => e.UserId),
        "type" => request.SortOrder == "asc" 
            ? query.OrderBy(e => e.Type) 
            : query.OrderByDescending(e => e.Type),
        _ => request.SortOrder == "asc" 
            ? query.OrderBy(e => e.CreatedAt) 
            : query.OrderByDescending(e => e.CreatedAt)
    };

    // Pagination
    var totalCount = await query.CountAsync();
    var page = Math.Max(1, request.Page);
    var pageSize = Math.Clamp(request.PageSize, 1, 100);
    
    var items = await query
        .Skip((page - 1) * pageSize)
        .Take(pageSize)
        .ToListAsync();

    return Ok(new EventQueryResponse
    {
        Items = items,
        TotalCount = totalCount,
        Page = page,
        PageSize = pageSize,
        TotalPages = (int)Math.Ceiling((double)totalCount / pageSize)
    });
}
```

## API Contract

### POST /api/events
**Request:**
```json
{
  "userId": "user123",
  "type": "Click",
  "description": "User clicked the buy button"
}
```

**Response 201:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "userId": "user123",
  "type": "Click",
  "description": "User clicked the buy button",
  "createdAt": "2026-04-10T14:30:00Z"
}
```

### POST /api/events/query
**Request:**
```json
{
  "userId": "user",
  "types": ["Click", "Purchase"],
  "sortBy": "CreatedAt",
  "sortOrder": "desc",
  "page": 1,
  "pageSize": 20
}
```

**Response 200:**
```json
{
  "items": [...],
  "totalCount": 150,
  "page": 1,
  "pageSize": 20,
  "totalPages": 8
}
```

## File Structure
```
apps/Event-Hub-BE/
├── Controllers/
│   └── EventsController.cs
├── Models/
│   └── (from previous story)
├── Data/
│   └── (from previous story)
└── Program.cs
```

## Definition of Done
- [ ] Controller with both endpoints implemented
- [ ] Filtering by UserId and Types works
- [ ] Sorting by CreatedAt, UserId, Type works
- [ ] Pagination returns correct metadata
- [ ] Create endpoint returns 201 with created event
- [ ] Test with curl or Postman
- [ ] No build errors

## Dependencies
- Story 2.1 (Database Models) must be complete

## Testing Commands
```bash
# Create event
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{"userId":"test","type":"Click","description":"Test event"}'

# Query events
curl -X POST http://localhost:5000/api/events/query \
  -H "Content-Type: application/json" \
  -d '{"page":1,"pageSize":10}'
```
