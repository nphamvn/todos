using Microsoft.EntityFrameworkCore;
using ToDo.Domain.Entities;
using Task = ToDo.Domain.Entities.Task;

namespace ToDo.Domain;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<List> Lists { get; set; }

    public DbSet<Task> Tasks { get; set; }
}