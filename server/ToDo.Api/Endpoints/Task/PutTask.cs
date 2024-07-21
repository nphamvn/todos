using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ToDo.Api.Extensions;
using ToDo.Domain;

namespace ToDo.Api.Endpoints.Task;

public static partial class MapEndpointExtensions
{
    public static void MapPutTask(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPut("tasks/{taskId}",
            async (ClaimsPrincipal claimsPrincipal, AppDbContext dbContext, string taskId, PutTaskRequest req) =>
            {
                var userId = claimsPrincipal.GetUserId();
                var task = await dbContext.Tasks
                    .Include(t => t.List)
                    .SingleAsync(t => t.Id == taskId && t.List.UserId == userId);
                
                task.Name = req.Name;
                task.Completed = req.Completed;
                
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

public class PutTaskRequest
{
    [Required]
    public string Name { get; set; }
    
    public bool Completed { get; set; }
}