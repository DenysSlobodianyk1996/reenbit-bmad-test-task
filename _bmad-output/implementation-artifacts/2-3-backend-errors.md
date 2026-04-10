---
story_id: "2.3"
epic: "Phase 2: Backend Implementation"
title: "Add Global Error Handling Middleware"
status: "ready-for-dev"
created: "2026-04-10"
---

# Story 2.3: Add Global Error Handling Middleware

## User Story
As a developer, I want to add global error handling middleware so that all API errors are handled consistently and return meaningful responses to the frontend.

## Acceptance Criteria

### 2.3.1 Exception Handler Middleware Created
- [ ] Add `UseExceptionHandler` middleware in `Program.cs`
- [ ] Configure error handling path
- [ ] Log exception details
- [ ] Return JSON error response

### 2.3.2 Error Response Format
- [ ] Return consistent error JSON:
  ```json
  {
    "error": "Exception message or generic error",
    "statusCode": 500
  }
  ```
- [ ] Set appropriate HTTP status code
- [ ] Set Content-Type to `application/json`

### 2.3.3 Error Handling Behavior
- [ ] Catch all unhandled exceptions
- [ ] Don't expose stack traces in production (optional enhancement)
- [ ] Log exception to console for debugging
- [ ] Return 500 for unhandled exceptions
- [ ] Return 400 for validation errors (ModelState)

## Technical Requirements

### Program.cs Updates
```csharp
// Add before app.UseRouting()
builder.Services.AddControllers();

var app = builder.Build();

// Configure exception handler
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;
        
        // Log the error
        if (exception != null)
        {
            Console.WriteLine($"Error: {exception.Message}");
            Console.WriteLine($"Stack Trace: {exception.StackTrace}");
        }

        var errorResponse = new
        {
            error = exception?.Message ?? "An unexpected error occurred",
            statusCode = 500
        };

        await context.Response.WriteAsJsonAsync(errorResponse);
    });
});

// CORS before other middleware
app.UseCors("AllowAngular");

app.UseRouting();
app.MapControllers();
```

### Validation Error Handling (Optional Enhancement)
Add to controller or as action filter:
```csharp
// In EventsController, CreateEvent action
if (!ModelState.IsValid)
{
    return BadRequest(new { 
        error = "Validation failed", 
        details = ModelState.Values.SelectMany(v => v.Errors)
    });
}
```

## Error Scenarios to Test

### 1. Database Connection Error
- Stop the application, delete .db file (if locked), restart
- Should return 500 with error message

### 2. Invalid JSON in Request
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d 'invalid json'
```
Expected: 500 with JSON error response

### 3. Null Reference in Code
- Temporarily add `throw new Exception("Test error")` in controller
- Should return 500 with "Test error" message

### 4. Validation Error
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{}'
```
Expected: 400 with validation details (if implemented)

## API Error Response Examples

### 500 Internal Server Error
```json
{
  "error": "Object reference not set to an instance of an object",
  "statusCode": 500
}
```

### 400 Bad Request (Validation)
```json
{
  "error": "Validation failed",
  "details": [
    { "field": "userId", "message": "The userId field is required." }
  ]
}
```

## Definition of Done
- [ ] Exception handler middleware configured
- [ ] All errors return JSON response
- [ ] Errors are logged to console
- [ ] Tested with intentional error scenarios
- [ ] Frontend receives proper error responses
- [ ] No build errors

## Dependencies
- Story 2.2 (Events Controller) should be complete or concurrent

## Notes
- Keep error messages user-friendly but informative
- Don't expose sensitive details (connection strings, file paths)
- Console logging is fine for test task; production would use ILogger
