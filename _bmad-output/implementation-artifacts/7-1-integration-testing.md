---
story_id: "7.1"
epic: "Phase 7: Integration and Testing"
title: "Full Stack Integration and Testing"
status: "ready-for-dev"
created: "2026-04-10"
---

# Story 7.1: Full Stack Integration and Testing

## User Story
As a developer, I want to verify the full stack works together so that I can ensure the Event-Hub application is functional end-to-end.

## Acceptance Criteria

### 7.1.1 Run Full Stack
- [ ] Start .NET API: `dotnet run` (ports 5000/5001)
- [ ] Start Angular: `nx serve` (port 4200)
- [ ] Verify CORS working (no errors in browser console)
- [ ] Verify both services running simultaneously

### 7.1.2 Test User Flows

**Flow 1: Create Event**
- [ ] Navigate to Create Event page
- [ ] Fill form with valid data
- [ ] Submit - verify success message
- [ ] Verify navigation to Event List
- [ ] Verify new event appears in list

**Flow 2: Filter Events**
- [ ] Create multiple events with different:
  - UserIds
  - Event types
- [ ] Filter by UserId - verify results update
- [ ] Filter by Event Type - verify results update
- [ ] Clear filters - verify all events show

**Flow 3: Pagination**
- [ ] Create 25+ events
- [ ] Verify pagination shows
- [ ] Change page - verify different events
- [ ] Change page size - verify correct count

**Flow 4: Error Handling**
- [ ] Stop API, try action - verify error toast
- [ ] Submit invalid data - verify validation errors
- [ ] Verify global error handler catches all errors

### 7.1.3 Code Review Items
- [ ] Remove unused imports
- [ ] Remove console.log statements (keep console.error for errors)
- [ ] Add basic comments for complex logic
- [ ] Ensure consistent formatting
- [ ] Check for TypeScript strict mode errors
- [ ] Verify no `any` types (replace with proper types)

### 7.1.4 Console Check
- [ ] No Angular errors in console
- [ ] No .NET errors in console
- [ ] No CORS errors
- [ ] No 404s for required resources

## Testing Commands

### Backend Tests
```bash
# Test create
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1","type":"Click","description":"Test click"}'

# Test query
curl -X POST http://localhost:5000/api/events/query \
  -H "Content-Type: application/json" \
  -d '{"page":1,"pageSize":10}'

# Test with filter
curl -X POST http://localhost:5000/api/events/query \
  -H "Content-Type: application/json" \
  -d '{"userId":"user1","types":["Click"],"page":1,"pageSize":10}'
```

### Frontend Tests
```bash
# Run lint
nx lint Event-Hub-FE

# Check TypeScript
nx build Event-Hub-FE

# Serve and test manually
nx serve Event-Hub-FE
```

## Manual Test Checklist

### Create Event
- [ ] Form validation works
- [ ] Submit disabled when invalid
- [ ] Success message shown
- [ ] Navigation happens
- [ ] Event appears in list

### Event List
- [ ] Events load on page open
- [ ] Loading spinner shows
- [ ] Table displays correctly
- [ ] Pagination works
- [ ] Filtering works
- [ ] Empty state handled

### Navigation
- [ ] Links work
- [ ] Active state shows
- [ ] Layout consistent

### Error Scenarios
- [ ] API down - error toast
- [ ] Validation error - field highlighted
- [ ] Network error - handled gracefully

## Definition of Done
- [ ] All user flows tested
- [ ] No console errors
- [ ] Code cleanup complete
- [ ] Application runs successfully
- [ ] Ready for documentation

## Dependencies
- All previous stories complete
- Both FE and BE running

## Notes
- This is verification story - no new code
- Focus on finding and fixing issues
- Document any bugs found
