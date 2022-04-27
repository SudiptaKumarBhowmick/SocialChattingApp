using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using API.Interfaces;
using API.Services;
using API.Data;
using Microsoft.EntityFrameworkCore;
using API.Helpers;
using API.SignalR;
using System;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services, IConfiguration _config)
        {
            services.AddSingleton<PresenceTracker>();
            services.Configure<CloudinarySettings>(_config.GetSection("CloudinarySettings"));
            services.AddScoped<ITokenService, TokenService>();
            services.AddScoped<IPhotoService, PhotoService>();
            services.AddScoped<IUnitOfWork, UnitOfWork>();
            services.AddScoped<LogUserActivity>();
            services.AddAutoMapper(typeof(AutoMapperProfiles).Assembly);
            services.AddDbContext<DataContext>(options =>
            {
                var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

                string connStr;

                // Depending on if in development or production, use either Heroku-provided
                // connection string, or development connection string from env var.
                if (env == "Development")
                {
                    // Use connection string from file.
                    connStr = _config.GetConnectionString("DefaultConnection");
                }
                else
                {
                    // Use connection string provided at runtime by Heroku.
                    var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

                    // Parse connection URL to connection string for Npgsql
                    connUrl = connUrl.Replace("postgres://", string.Empty);
                    var splitedConnUrlPart1 = connUrl.Split('@')[0];
                    var splitedConnUrlPart2 = connUrl.Split('@')[1];
                    
                    var postgresUser = splitedConnUrlPart1.Split(':')[0];
                    var postgresPassword = splitedConnUrlPart1.Split(':')[1];
                    var postgresDbHost = splitedConnUrlPart2.Split(':')[0];
                    var postgresDbPort = splitedConnUrlPart2.Split('/')[0].Split(':')[1];
                    var postgresDbName = splitedConnUrlPart2.Split('/')[1];

                    connStr = $"Server={postgresDbHost};Port={postgresDbPort};User Id={postgresUser};Password={postgresPassword};Database={postgresDbName};SSL Mode=Prefer;Trust Server Certificate=True;";
                }

                // Whether the connection string came from the local development configuration file
                // or from the environment variable from Heroku, use it to set up your DbContext.
                options.UseNpgsql(connStr);
            });

            return services;
        }
    }
}