using InventoryManagement.Backend.Data;
using InventoryManagement.Backend.Repositories;
using InventoryManagement.Backend.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Database
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configuration for Dependency Injection
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IStockService, StockService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!))
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy =>
        {
            policy.AllowAnyOrigin()
                  .AllowAnyHeader()
                  .AllowAnyMethod();
        });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Auto-apply migrations
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    db.Database.Migrate();

    // Auto-seed Admin User if not exists
    if (!db.Users.Any())
    {
        db.Users.Add(new InventoryManagement.Backend.Models.User
        {
            Name = "Admin User",
            Email = "admin@example.com",
            Password = "admin", // Simple password for testing
            Role = "Admin",
            CreatedAt = DateTime.UtcNow
        });
        db.SaveChanges();
    }

    // Auto-seed Categories if not exists
    if (!db.Categories.Any())
    {
        db.Categories.AddRange(
            new InventoryManagement.Backend.Models.Category { Name = "Electronics", Description = "Electronic devices and accessories" },
            new InventoryManagement.Backend.Models.Category { Name = "Clothing", Description = "Apparel, footwear, and accessories" },
            new InventoryManagement.Backend.Models.Category { Name = "Home & Garden", Description = "Furnishings and outdoor items" }
        );
        db.SaveChanges();
    }

    // Auto-seed Products if not exists
    if (!db.Products.Any())
    {
        var elecCategory = db.Categories.FirstOrDefault(c => c.Name == "Electronics");
        var clothCategory = db.Categories.FirstOrDefault(c => c.Name == "Clothing");

        if (elecCategory != null && clothCategory != null)
        {
            db.Products.AddRange(
                new InventoryManagement.Backend.Models.Product { Name = "Wireless Headphones", Price = 150.00m, Quantity = 75, CategoryId = elecCategory.Id },
                new InventoryManagement.Backend.Models.Product { Name = "Cotton T-Shirt", Price = 25.00m, Quantity = 200, CategoryId = clothCategory.Id },
                new InventoryManagement.Backend.Models.Product { Name = "Smartphone", Price = 800.00m, Quantity = 50, CategoryId = elecCategory.Id }
            );
            db.SaveChanges();
        }
    }
}

// app.UseHttpsRedirection();
app.UseCors("AllowFrontend");

// Ensure wwwroot/images/products exists
var productsImagesPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "products");
if (!Directory.Exists(productsImagesPath))
{
    Directory.CreateDirectory(productsImagesPath);
}
app.UseStaticFiles();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
