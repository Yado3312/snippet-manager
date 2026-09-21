using backend.Data;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddOpenApi();

// habilitamos la peticino del famosisimo cors para poder recibir peticiones desde el cliente
const string FrontendPolicy = "Frontend";
builder.Services.AddCors(options =>
    options.AddPolicy(FrontendPolicy, policy => policy
        .WithOrigins("http://localhost:3000", "http://127.0.0.1:3000")
        .AllowAnyHeader()
        .AllowAnyMethod()));

var app = builder.Build();

_ = DatabaseManager.Instance; // aqui una cosa nueva que aprendi: " _ = "  es una expresion que ejecuta una linea de codigo sin tener que guardar el valor que retorna

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}


app.UseCors(FrontendPolicy); // Activar/ establecer la politica cors antes de iniciar con todo el proceso de arranque del servidor.

app.UseAuthorization();
app.MapControllers();

app.Run();