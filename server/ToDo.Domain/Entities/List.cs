namespace ToDo.Domain.Entities;

public class List : BaseEntity
{
    public required string UserId { get; set; }

    public required string Id { get; set; }

    public required string Name { get; set; }

    public ICollection<Task> Tasks { get; set; } = new List<Task>();
}