using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using ToDo.Domain;
using ListEntity = ToDo.Domain.Entities.List;

namespace ToDo.Api.Endpoints.List;

public static partial class MapEndpointExtensions
{
    public static void MapPostList(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapPost("lists",
            async (ClaimsPrincipal claimsPrincipal, AppDbContext dbContext, PostListRequest req) =>
            {
                var userId = claimsPrincipal.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value;
                var list = new ListEntity
                {
                    UserId = userId,
                    Id = req.Id,
                    Name = req.Name,
                    CreatedAt = DateTime.UtcNow
                };
                await dbContext.Lists.AddAsync(list);
                await dbContext.SaveChangesAsync();
                return new
                {
                    Id = list.Id,
                    Name = list.Name,
                    CreatedAt = list.CreatedAt
                };
            });
    }
}

public class PostListRequest
{
    [Required]
    public string Id { get; set; }
    
    [Required]
    public string Name { get; set; }
}