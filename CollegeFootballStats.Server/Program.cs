using CollegeFootballStats.Core.Queries;
using CollegeFootballStats.Core.Models;
using CollegeFootballStats.Core;
using Dapper;
using CollegeFootballStats.Server;
using Oracle.ManagedDataAccess.Client;
using System.Data.SqlClient;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using CollegeFootballStats.Core.Models;
using CollegeFootballStats.Core.Queries;

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
    var tableNames = new[]
    {
        "TEAM", "COACH", "COACHINGRECORD", "CONFERENCE", "CONFERENCEMEMBERSHIP",
        "DRAFTPICK", "GAME", "ROSTER", "PLAYER", "PLAYERGAMESTAT",
        "PLAYERSEASONSTAT", "POLL", "STATCATEGORY", "STATTYPE", "TEAMGAMESTAT", "RECRUITINGPLAYERS"
    };

    var response = new TupleCount();
    var results = new List<int>();

    foreach (var tableName in tableNames)
    {
        var count = await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable(tableName));
        results.Add(count);
    }

    response.Teams = results[0];
    response.Coaches = results[1];
    response.CoachingRecords = results[2];
    response.Conferences = results[3];
    response.ConferenceMemberships = results[4];
    response.DraftPicks = results[5];
    response.Games = results[6];
    response.Rosters = results[7];
    response.Players = results[8];
    response.PlayerGameStats = results[9];
    response.PlayerSeasonStats = results[10];
    response.Polls = results[11];
    response.StatCategories = results[12];
    response.StatTypes = results[13];
    response.TeamGameStats = results[14];
    response.RecruitingPlayers = results[15];

    response.TotalTuples = results.Sum();

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

app.MapGet("/coaches/{teamID}", async (SqlCommandManager queryManager, int teamID) =>
{
    ISqlCommand query = new GetCoachesByTeam(teamID);
    var coaches = await queryManager
        .QueryAsync<Coach>(query);

    return Results.Ok(coaches.ToList());
});


app.MapGet("/coaching-impact", async (SqlCommandManager queryManager, string teamId, string coachId, string startYear, string endYear) =>
{
    ISqlCommand query = new CoachingImpact(teamId, coachId, startYear, endYear);
    var result = await queryManager.QueryAsync<CoachingImpactResult>(query);
    return Results.Ok(result);
});

app.MapGet("/player-positions", async (SqlCommandManager queryManager) =>
{
    var query = new GetAllPlayerPositions();
    var result = await queryManager.QueryAsync<PlayerPosition>(query);
    return Results.Ok(result);
});

// For the ConferenceClash page woo
app.MapGet("/conference-evolution", async (
    SqlCommandManager queryManager,
    [FromQuery] int conferenceId,
    [FromQuery] int? teamId,
    [FromQuery] int startYear,
    [FromQuery] int endYear) =>
{
    try
    {
        var query = new GetConferenceEvolution(conferenceId, teamId, startYear, endYear);
        var result = await queryManager.QueryAsync<ConferenceEvolutionResult>(query);

        if (!result.Any())
        {
            return Results.NotFound("No data found for the specified parameters");
        }

        return Results.Ok(result);
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error in conference-evolution endpoint: {ex}");
        return Results.Problem("Error fetching conference evolution data");
    }
})
.WithName("GetConferenceEvolution")
.WithOpenApi(operation =>
{
    operation.Summary = "Get conference offensive/defensive performance evolution";
    operation.Description = "Retrieves points scored and allowed per game over time for a conference or specific team";
    return operation;
});

app.MapGet("/teams/conference/{conferenceId}", async (SqlCommandManager queryManager, int conferenceId) =>
{
    try
    {
        var query = new GetTeamsByConference(conferenceId);
        var teams = await queryManager.QueryAsync<Team>(query);

        if (!teams.Any())
        {
            return Results.NotFound($"No teams found for conference ID: {conferenceId}");
        }

        return Results.Ok(teams);
    }
    catch (Exception ex)
    {
        Console.Error.WriteLine($"Error fetching teams by conference: {ex}");
        return Results.Problem("Error fetching teams");
    }
})
.WithName("GetTeamsByConference")
.WithOpenApi(operation =>
{
    operation.Summary = "Get teams by conference";
    operation.Description = "Returns all teams currently in the specified conference";
    return operation;
});

app.MapGet("/player-performance-by-position", async (SqlCommandManager queryManager, [FromQuery] string position, [FromQuery] int startYear, [FromQuery] int endYear) =>
{
    var query = new PlayerPerformanceByPosition(position, startYear, endYear);
    var result = await queryManager.QueryAsync<PercentilePerformanceResult>(query);
    return Results.Ok(result);
});

app.MapFallbackToFile("/index.html");

app.Run();