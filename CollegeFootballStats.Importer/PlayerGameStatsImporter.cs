using CollegeFootballStats.Core.Queries;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Importer
{
    internal class PlayerGameStatsImporter : BaseImporter
    {
        public PlayerGameStatsImporter(ImporterConfig config, ILogger logger) : base(config, logger)
        {
        }

        public override async Task ImportAsync()
        {
            var playersImported = await TableHasRecords(PLAYERS_TABLE);
            if (!playersImported)
            {
                _logger.LogError("No players found in database! Players are required to import player game stats. Please import players first!");
                return;
            }

            var gamesImported = await TableHasRecords(GAMES_TABLE); 
            if (!gamesImported)
            {
                _logger.LogError("No games found in database! Games are required to import player game stats. Please import games first!");
                return;
            }

            try
            {
                _logger.LogInformation("Beginning import. This may take a while...");
                // work backwards to prioritize recent data
                for (int season = DEFAULT_MAX_SEASON; season >= DEFAULT_MIN_SEASON; season--)
                {
                    _logger.LogInformation($"Beginning import for season: {season}");
                    for (int week = MIN_SEASON_WEEK; week <= MAX_SEASON_WEEK; week++)
                    {
                        // the 'both' actually works here for seasontype. yay
                        string queryUrl = $"games/players?year={season}&week={week}&seasonType=both";
                        var gameStats = (await _httpClient.GetFromJsonAsync<List<PlayerGameStatResponse>>(queryUrl))?.ToList() ?? new List<PlayerGameStatResponse>();
                        _logger.LogInformation($"Found stats for {gameStats?.Count ?? 0} games for week {week} of season {season}");

                        if (gameStats == null || gameStats?.Count() == 0)
                        {
                            _logger.LogInformation("No player game stats found for this week. Skipping...");
                        }

                        // This nested loop isn't as awful as it looks.
                        // yes there are a lot of stats, but there only 2 teams per game
                        // and a handful of categories. this loop just flattens it all out
                        foreach (var game in gameStats)
                        {
                            foreach (var team in game.Teams)
                            {
                                foreach (var category in team.Categories)
                                {
                                    foreach (var type in category.Types)
                                    {
                                        foreach (var athlete in type.Athletes)
                                        {
                                            // We only want stats that we can parse into an aggregatable value
                                            if (decimal.TryParse(athlete.Stat, out decimal statValue) && athlete.Id.GetValueOrDefault() > 0)
                                            {
                                                var command = new InsertPlayerGameStat(game.Id, athlete.Id.GetValueOrDefault(), statValue, category.Name, type.Name);
                                                await _sqlCommandManager.ExecuteAsync(command);
                                                _logger.LogDebug($"INSERTED PLAYER GAME STAT: Game: {game.Id} Category: {category.Name} Type: {type.Name} Player: {athlete.Name} Stat: {athlete.Stat}");
                                            }
                                        }
                                    }
                                }
                            }
                        }
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
