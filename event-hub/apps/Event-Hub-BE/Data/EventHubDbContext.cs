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
