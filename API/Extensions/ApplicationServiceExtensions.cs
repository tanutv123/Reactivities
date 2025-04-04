﻿using Application.Activities;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using FluentValidation.AspNetCore;
using Infrastructure.EmailService;
using Infrastructure.EmailService.Settings;
using Infrastructure.Photos;
using Infrastructure.Security;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Extensions
{
    public static class ApplicationServiceExtensions
    {
        public static IServiceCollection AddServices(this IServiceCollection services, IConfiguration config)
        {
            services.AddDbContext<DataContext>(opt =>
            {
                opt.UseNpgsql(config.GetConnectionString("DefaultConnection"));
            });
            services.AddCors(opt =>
            {
                opt.AddPolicy("CorsPolicy", policy =>
                {
                    policy.AllowAnyHeader()
                    .AllowAnyMethod()
                    .AllowCredentials()
                    .WithExposedHeaders("WWW-Authenticate", "Pagination")
                    .WithOrigins("http://localhost:3000", "https://localhost:3000");
                });
            });

            services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(typeof(List.Handler).Assembly));
            services.AddAutoMapper(typeof(MappingProfiles).Assembly);

            services.AddFluentValidationAutoValidation();
            services.AddValidatorsFromAssemblyContaining<Create>();

            services.AddHttpContextAccessor();
            services.AddScoped<IUserAccessor, UserAccessor>();
            services.AddScoped<IPhotoAccessor, PhotoAccessor>();
            services.AddScoped<IEmailService, EmailService>();

            services.Configure<CloudinarySettings>(config.GetSection("CloudinarySettings"));
            services.Configure<SendInBlue>(config.GetSection("SendInBlue"));

            services.AddSignalR();

            return services;
        }
    }
}
