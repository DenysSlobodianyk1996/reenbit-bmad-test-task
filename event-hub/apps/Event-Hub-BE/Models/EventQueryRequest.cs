namespace Event_Hub_BE.Models;

public class EventQueryRequest
{
    public string? UserId { get; set; }
    public List<EventType>? Types { get; set; }
    public string SortBy { get; set; } = "CreatedAt";
    public string SortOrder { get; set; } = "desc";
    public int Page { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}
