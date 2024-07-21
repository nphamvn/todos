using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using ToDo.Api.Extensions;
using ToDo.Domain;

namespace ToDo.Api.Endpoints.List;

public static partial class MapEndpointExtensions
{
    public static void MapDeleteList(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapDelete("lists/{listId}",
            async (ClaimsPrincipal claimsPrincipal, AppDbContext dbContext, string listId) =>
            {
                var userId = claimsPrincipal.GetUserId();
                var list = await dbContext.Lists
                    .Include(l => l.Tasks)
                    .SingleAsync(l => l.Id == listId && l.UserId == userId);
                dbContext.Lists.Remove(list);
                await dbContext.SaveChangesAsync();

                return Results.NoContent();
            });
    }
}

