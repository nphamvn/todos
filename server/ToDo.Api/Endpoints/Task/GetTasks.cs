using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ToDo.Domain;

namespace ToDo.Api.Endpoints.Task;

public static partial class MapEndpointExtensions
{
    public static void MapGetTasks(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("lists/{listId}/tasks",
            async (ClaimsPrincipal claimsPrincipal, AppDbContext dbContext, string listId) =>
            {
                var userId = claimsPrincipal.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value;
                var list = await dbContext.Lists
                    .Include(l => l.Tasks)
                    .SingleAsync(l => l.Id == listId && l.UserId == userId);
                return list.Tasks.Select(t => new
                {
                    t.Id,
                    t.Name,
                    t.CreatedAt,
                    t.ModifiedAt
                });
            });
    }
}

