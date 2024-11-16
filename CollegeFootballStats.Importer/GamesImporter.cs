using CollegeFootballStats.Core.Models;
using CollegeFootballStats.Core.Queries;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;

namespace CollegeFootballStats.Importer
{
    internal class GamesImporter : BaseImporter
    {
        public GamesImporter(ImporterConfig config, ILogger logger) : base(config, logger)
        {
        }

        public override async Task ImportAsync()
        {
            _logger.LogInformation("Fetching existing teams from database...");

            // We are going to get FK constraint errors if we try to insert games without teams
            var teams = (await _sqlCommandManager.QueryAsync<Team>(new GetTeams())).ToList();
            if (teams.Count == 0)
            {
                _logger.LogError("No teams found in database! Teams are required to import games. Please import teams first!");
                return;
            }   

            _logger.LogInformation($"Found {teams.Count} teams in the database");

            try
            {
                for (int season = DEFAULT_MIN_SEASON; season <= DEFAULT_MAX_SEASON; season++) {
                    var response = await _httpClient.GetFromJsonAsync<List<GameResponse>>($"games?year={season}&seasonType=both");
                    _logger.LogInformation($"Fetched {response.Count} regular and postseason games for {season} Season: ");
                    foreach (var game in response)
                    {
                        var insertGameCommand = new InsertGame(game.Id, game.Start_Date, game.Season, game.Week, game.Home_Id,
                            game.Away_Id, game.Home_Points, game.Away_Points, game.Completed, game.Season_Type == "postseason");

                        await _sqlCommandManager.ExecuteAsync(insertGameCommand);

                        _logger.LogInformation($"INSERTED RECORD FOR GAME: {game.Id} Date: {game.Start_Date} Season: {game.Season} Week: {game.Week} Home: {game.Home_Team} " +
                            $"Away: {game.Away_Team} Home Points: {game.Home_Points} Away Points: {game.Away_Points} Completed: {game.Completed} Season type: {game.Season_Type}");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
        }
    }
}
