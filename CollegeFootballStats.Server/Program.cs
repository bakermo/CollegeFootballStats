using CollegeFootballStats.Core.Queries;
using CollegeFootballStats.Core.Models;
using CollegeFootballStats.Core;
using Dapper;
using CollegeFootballStats.Server;

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
    ISqlCommand query = new GetAllTeams();
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

app.MapGet("/tuples", async (SqlCommandManager queryManager) => {
    // yes. This is inefficient. Yes. there is a better way to do this in one query
    // but right now im tired and don't care
    var response = new TupleCount();
    response.Teams = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("TEAM"));
    response.Coaches = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("COACH"));
    response.CoachingRecords = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("COACHINGRECORD"));
    response.Conferences = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("CONFERENCE"));
    response.ConferenceMemberships = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("CONFERENCEMEMBERSHIP"));
    response.DraftPicks = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("DRAFTPICK"));
    response.Games = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("GAME"));
    response.Rosters = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("ROSTER"));
    response.Players = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("PLAYER"));
    response.PlayerGameStats = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("PLAYERGAMESTAT"));
    response.PlayerSeasonStats = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("PLAYERSEASONSTAT"));
    response.Polls = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("POLL"));
    response.StatCategories = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("STATCATEGORY"));
    response.StatTypes = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("STATTYPE"));
    response.TeamGameStats = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable("TEAMGAMESTAT"));
    response.TotalTuples = 
        response.Teams + 
        response.Coaches + 
        response.CoachingRecords + 
        response.Conferences + 
        response.ConferenceMemberships + 
        response.DraftPicks + 
        response.Games + 
        response.Rosters + 
        response.Players + 
        response.PlayerGameStats +
        response.PlayerSeasonStats +
        response.Polls +
        response.StatCategories +
        response.StatTypes +
        response.TeamGameStats;

    return Results.Ok(response);
});

app.MapFallbackToFile("/index.html");

app.Run();