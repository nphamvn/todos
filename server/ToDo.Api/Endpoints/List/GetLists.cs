using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ToDo.Api.Extensions;
using ToDo.Domain;

namespace ToDo.Api.Endpoints.List;

public static partial class MapEndpointExtensions
{
    public static void MapGetLists(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("lists", async (ClaimsPrincipal claimsPrincipal, AppDbContext dbContext) =>
        {
            var userId = claimsPrincipal.GetUserId();
            var lists = await dbContext.Lists.Include(list => list.Tasks).Where(l => l.UserId == userId).ToListAsync();
            return lists.Select(l => new
            {
                l.Id,
                l.Name,
                TaskCount = l.Tasks.Count,
                l.CreatedAt,
                l.ModifiedAt
            }).ToList();
        });
    }
}

