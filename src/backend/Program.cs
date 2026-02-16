using backend.Datos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddDbContext<ContextoBaseDatos>(opciones =>
    opciones.UseSqlServer(builder.Configuration.GetConnectionString("CadenaConexionDefault")));

// 2. Configurar Autenticaci�n JWT
var claveJwt = builder.Configuration["ConfiguracionJwt:ClaveSecreta"];
var llaveBytes = Encoding.UTF8.GetBytes(claveJwt);

builder.Services.AddAuthentication(config => {
    config.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    config.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(config => {
    config.RequireHttpsMetadata = false;
    config.SaveToken = true;
    config.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(llaveBytes),
        ValidateIssuer = false,
        ValidateAudience = false,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
// Configurar CORS para desarrollo
builder.Services.AddCors(opciones =>
{
    opciones.AddPolicy(name: "PermitirTodo", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Habilitar CORS (debe ir antes de la autenticación/autorization)
app.UseCors("PermitirTodo");

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
