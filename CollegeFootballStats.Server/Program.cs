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
    var tableNames = new[]
    {
        "TEAM", "COACH", "COACHINGRECORD", "CONFERENCE", "CONFERENCEMEMBERSHIP",
        "DRAFTPICK", "GAME", "ROSTER", "PLAYER", "PLAYERGAMESTAT",
        "PLAYERSEASONSTAT", "POLL", "STATCATEGORY", "STATTYPE", "TEAMGAMESTAT"
    };

    var response = new TupleCount();
    var tasks = tableNames.Select(async tableName =>
        await queryManager.QueryFirstOrDefault<int>(new CountTuplesByTable(tableName))
    ).ToArray();

    var results = await Task.WhenAll(tasks);

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

app.MapGet("/player-positions", async (SqlCommandManager queryManager) =>
{
    var query = new GetAllPlayerPositions();
    var result = await queryManager.QueryAsync<PlayerPosition>(query);
    return Results.Ok(result);
});

app.MapFallbackToFile("/index.html");

app.Run();