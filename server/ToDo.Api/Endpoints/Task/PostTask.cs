using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ToDo.Api.Extensions;
using ToDo.Domain;
using TaskEntity = ToDo.Domain.Entities.Task;

namespace ToDo.Api.Endpoints.Task;

public static partial class MapEndpointExtensions
{
    public static void MapPostTask(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("lists/{listId}/tasks",
            async (ClaimsPrincipal claimsPrincipal, AppDbContext dbContext, string listId, PostTaskRequest req) =>
            {
                var userId = claimsPrincipal.GetUserId();
                var list = await dbContext.Lists
                    .Include(l => l.Tasks)
                    .SingleAsync(l => l.Id == listId && l.UserId == userId);

                var task = new TaskEntity
                {
                    Id = req.Id,
                    Name = req.Name,
                    Completed = req.Completed,
                    List = list,
                    CreatedAt = DateTime.UtcNow
                };
                list.Tasks.Add(task);
                await dbContext.SaveChangesAsync();
                return new
                {
                    task.Id,
                    task.Name,
                    task.CreatedAt
                };
            });
    }
}

public class PostTaskRequest
{
    [Required]
    public string Id { get; set; }
    
    [Required]
    public string Name { get; set; }
    
    public bool Completed { get; set; }
}