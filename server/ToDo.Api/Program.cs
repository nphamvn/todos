using System.Security.Claims;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using ToDo.Api.Endpoints.List;
using ToDo.Api.Endpoints.Task;
using ToDo.Api.Extensions;
using ToDo.Domain;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.Authority = builder.Configuration["Authentication:JwtBearer:Authority"];
    options.Audience = builder.Configuration["Authentication:JwtBearer:Audience"];
});

builder.Services.AddAuthorization();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins(builder.Configuration["Cors:AllowedOrigins"]!);
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
        (ClaimsPrincipal principal) => principal.GetUserId())
    .RequireAuthorization();

app.MapPostList();
app.MapGetLists();
app.MapDeleteList();

app.MapGetTasks();
app.MapPostTask();
app.MapPutTask();
app.MapDeleteTask();

app.Run();