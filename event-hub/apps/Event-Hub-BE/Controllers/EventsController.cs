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
    public async Task<ActionResult<Event>> CreateEvent([FromBody] Event eventItem)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(new
            {
                error = "Validation failed",
                details = ModelState.Values.SelectMany(v => v.Errors.Select(e => e.ErrorMessage))
            });
        }

        eventItem.Id = Guid.NewGuid();
        eventItem.CreatedAt = DateTime.UtcNow;

        _context.Events.Add(eventItem);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(CreateEvent), new { id = eventItem.Id }, eventItem);
    }

    [HttpPost("query")]
    public async Task<ActionResult<EventQueryResponse>> QueryEvents([FromBody] EventQueryRequest request)
    {
        var query = _context.Events.AsQueryable();

        // Filtering by UserId
        if (!string.IsNullOrEmpty(request.UserId))
            query = query.Where(e => e.UserId.Contains(request.UserId));

        // Filtering by Types
        if (request.Types?.Any() == true)
            query = query.Where(e => request.Types.Contains(e.Type));

        // Sorting
        query = request.SortBy?.ToLower() switch
        {
            "userid" => request.SortOrder?.ToLower() == "asc"
                ? query.OrderBy(e => e.UserId)
                : query.OrderByDescending(e => e.UserId),
            "type" => request.SortOrder?.ToLower() == "asc"
                ? query.OrderBy(e => e.Type)
                : query.OrderByDescending(e => e.Type),
            _ => request.SortOrder?.ToLower() == "asc"
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
}
