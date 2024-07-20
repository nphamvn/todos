using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ToDo.Domain;

namespace ToDo.Api.Endpoints.List;

public static partial class MapEndpointExtensions
{
    public static void MapGetLists(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("lists", async (ClaimsPrincipal claimsPrincipal, AppDbContext dbContext) =>
        {
            var userId = claimsPrincipal.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value;
            var lists = await dbContext.Lists.Where(l => l.UserId == userId).Include(list => list.Tasks).ToListAsync();
            return lists.Select(l => new
            {
                Id = l.Id,
                Name = l.Name,
                TaskCount = l.Tasks.Count,
                CreatedAt = l.CreatedAt,
                ModifiedAt = l.ModifiedAt
            }).ToList();
        });
    }
}

