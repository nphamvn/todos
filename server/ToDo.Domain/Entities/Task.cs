namespace ToDo.Domain.Entities;

public class Task : BaseEntity
{
    public required List List { get; set; }

    public required string Id { get; set; }

    public required string Name { get; set; }

    public bool Completed { get; set; }
}