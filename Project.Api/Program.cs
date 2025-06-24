using FluentValidation;
using FluentValidation.AspNetCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Project.Api.Validators;
using Project.Application;
using Project.Application.ViewModels;
using Project.Infra.Data;
using Project.Infra.Ioc;
using System.Text;

var builder = WebApplication.CreateBuilder(args);
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("ConexaoBD"), p => p.MigrationsAssembly("Project.Infra.Data"));

});

// Add services to the container.
//FluentValidator
builder.Services.AddFluentValidationAutoValidation();
builder.Services.AddFluentValidationClientsideAdapters();


//Fluent validators
builder.Services.AddTransient<IValidator<EntryVM>, EntryVMValidator>();

//register IoC
DependencyContainer.RegisterServices(builder.Services);

//Automapper
AutoMapperDependencyInjection.AddApplication(builder.Services);

//JWT
//builder.Services.AddAuthentication(opt =>
//{
//    opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//}).AddJwtBearer(options =>
//{
//    options.RequireHttpsMetadata = false;
//    options.SaveToken = true;
//    options.TokenValidationParameters = new TokenValidationParameters
//    {
//        ValidateIssuer = true,
//        ValidateAudience = true,
//        ValidateLifetime = true,
//        ValidateIssuerSigningKey = true,
//        ValidIssuer = builder.Configuration["Jwt:Issuer"],
//        ValidAudience = builder.Configuration["Jwt:Audience"],
//        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
//    };
//});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Swagger Web API",
        Version = "v1",
        Contact = new OpenApiContact() { Name = "Jose Claudio Cardoso", Email = "jccardosors@gmail.com" },
        License = new OpenApiLicense() { Name = "MIT License", Url = new Uri("https://opensource.org/licenses/MIT") }
    });
    options.IncludeXmlComments(Path.Combine(System.AppContext.BaseDirectory, "DemoSwaggerAnnotation.xml"));

    //options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    //{
    //    Scheme = "Bearer",
    //    BearerFormat = "JWT",
    //    Name = "Authorization",
    //    In = ParameterLocation.Header,
    //    Type = SecuritySchemeType.Http,
    //    Description = "Acesso protegido utilize o Token obtido em \"api/Autenticate/Autenticate\", informe apenas o Token, sem o Bearer, para autenticar nesta api."
    //});
    //options.AddSecurityRequirement(new OpenApiSecurityRequirement
    //{
    //    {
    //        new OpenApiSecurityScheme
    //        {
    //            Reference = new OpenApiReference
    //            {
    //                Type = ReferenceType.SecurityScheme,
    //                Id = "Bearer"
    //            }
    //        },
    //        Array.Empty<string>()
    //    }
    //});

});

//builder.Services.AddCors(options =>
//{
//    options.AddPolicy(name: MyAllowSpecificOrigins,
//                      policy =>
//                      {
//                          policy.WithOrigins("http://localhost:3000/").AllowAnyHeader().AllowAnyMethod();
//                      });
//});


//builder.Services.AddCors(setup => {
//    setup.AddPolicy("CorsPolicy", builder => {
//        builder.AllowAnyHeader();
//        builder.AllowAnyMethod();
//        builder.AllowAnyOrigin();
//        builder.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod();
//    });
//});

// Replace the problematic line with the following code:
//builder.Services.Configure<MvcOptions>(options =>
//{
//    options.Filters.Add(CorsAuthorizationFilterFactory("CorsPolicy"));
//});

var app = builder.Build();

//app.UseCors(setup => {
//    setup.WithOrigins("http://localhost:3000").AllowAnyHeader().AllowAnyMethod();
//    });




// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
app.UseSwagger();
// app.UseSwaggerUI();
app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "api Teste v1"));
//}

{
    var scope = app.Services.CreateScope();
    var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    dbContext.Database.Migrate();
    //dbContext.Database.EnsureCreated();
}


app.UseHttpsRedirection();

app.UseCors(x => x
               .AllowAnyMethod()
               .AllowAnyHeader()
               .SetIsOriginAllowed(origin => true) // allow any origin
               ); // allow credentials

app.UseRouting();
//app.UseCors("CorsPolicy");

//app.UseCors(MyAllowSpecificOrigins);
//app.UseCors(option => option.WithOrigins("http://localhost:3000/").AllowAnyOrigin().AllowAnyMethod());

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
