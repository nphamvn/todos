using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ToDo.Api.Extensions;
using ToDo.Domain;

namespace ToDo.Api.Endpoints.Task;

public static partial class MapEndpointExtensions
{
    public static void MapDeleteTask(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapDelete("tasks/{taskId}",
            async (ClaimsPrincipal claimsPrincipal, AppDbContext dbContext, string taskId) =>
            {
                var userId = claimsPrincipal.GetUserId();
                var task = await dbContext.Tasks
                    .Include(t => t.List)
                    .SingleAsync(t => t.Id == taskId && t.List.UserId == userId);
                
                dbContext.Tasks.Remove(task);
                await dbContext.SaveChangesAsync();

                return Results.NoContent();
            });
    }
}