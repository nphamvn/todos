using System.Security.Claims;
using FastEndpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using ToDo.Api.Endpoints.List;
using ToDo.Api.Endpoints.Task;
using ToDo.Domain;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// 1. Add Authentication Services
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.Authority = "https://dev-vzxphouz.us.auth0.com/";
    options.Audience = "todo";
});

builder.Services.AddAuthorization();
builder.Services.AddCors((options) =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173");
    });
});

//builder.Services.AddFastEndpoints();
builder.Services.AddHealthChecks();

builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseAuthentication();
app.UseAuthorization();

app.MapHealthChecks("health");
app.MapGet("whoami",
        (ClaimsPrincipal principal) => principal.Claims.Single(c => c.Type == ClaimTypes.NameIdentifier).Value)
    .RequireAuthorization();

app.MapPostList();
app.MapGetLists();

app.MapGetTasks();
app.MapPostTask();

app.Run();