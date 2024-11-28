using CollegeFootballStats.Core.Queries;
using CollegeFootballStats.Core.Models;
using CollegeFootballStats.Core;
using Dapper;
using CollegeFootballStats.Server;
using Oracle.ManagedDataAccess.Client;
using System.Data.SqlClient;
using System.Data;

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

app.MapGet("/team-recruiting-draft-data", async (SqlCommandManager queryManager, int startYear, int endYear) =>
{
    var query = new GetTeamRecruitingAndDraft(startYear, endYear);

    var data = await queryManager.QueryAsync<TeamRecruitingAndDraftResult>(query);
    return Results.Ok(data);
});

app.MapGet("/teams/draft-performance", async (SqlCommandManager queryManager, int teamId, int conferenceId, int startSeason, int endSeason) =>
{
    ISqlCommand query = new GetTeamDraftPerformance(teamId, conferenceId, startSeason, endSeason);
    var result = await queryManager.QueryAsync<TeamDraftPerformance>(query);
    return Results.Ok(result);
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

app.MapGet("/players", async (SqlCommandManager queryManager) =>
{
    ISqlCommand query = new GetAllPlayers();
    var players = await queryManager.QueryAsync<Player>(query);
    return Results.Ok(players.ToList());
});

app.MapGet("/conferences", async (SqlCommandManager queryManager) =>
{
    ISqlCommand query = new GetAllConferences();
    var conferences = await queryManager
        .QueryAsync<Conference>(query);

    return Results.Ok(conferences.ToList());
});

app.MapGet("/coaches", async (SqlCommandManager queryManager) =>
{
    ISqlCommand query = new GetAllCoaches();
    var coaches = await queryManager
        .QueryAsync<Coach>(query);

    return Results.Ok(coaches.ToList());
});

app.MapGet("/player-positions", async (SqlCommandManager queryManager) =>
{
    var query = new GetAllPlayerPositions();
    var result = await queryManager.QueryAsync<PlayerPosition>(query);
    return Results.Ok(result);
});

app.MapFallbackToFile("/index.html");

app.Run();