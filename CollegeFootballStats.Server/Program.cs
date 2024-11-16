using CollegeFootballStats.Core.Queries;
using CollegeFootballStats.Core.Models;
using CollegeFootballStats.Core;
using Dapper;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton(sp =>
{
    var connectionString = sp.GetRequiredService<IConfiguration>().GetConnectionString("UFOracle");
    return new SqlCommandManager(connectionString);
});


var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

SqlMapper.RemoveTypeMap(typeof(bool));
SqlMapper.AddTypeHandler(typeof(bool), new BoolToNumberHandler());

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

// query endpoints go here
app.MapGet("/teams", async (SqlCommandManager queryManager) =>
{
    ISqlCommand query = new GetTeams();
    var teams = await queryManager
        .QueryAsync<Team>(query);
    
    return Results.Ok(teams.ToList());
});

app.MapGet("/team/{abbreviation}", async(SqlCommandManager queryManager, string abbreviation) =>
{
    // this is some contrived example of passing in a parameter to a query
    ISqlCommand query = new GetTeamByAbbreviation(abbreviation);
    var team = await queryManager
        .QueryFirstOrDefault<Team>(query);

    if (team == null)
    {
        return Results.NotFound();
    }

    return Results.Ok(team);
});

app.MapFallbackToFile("/index.html");

app.Run();