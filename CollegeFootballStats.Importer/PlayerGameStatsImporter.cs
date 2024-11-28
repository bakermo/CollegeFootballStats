using CollegeFootballStats.Core.Queries;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http;
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

            var statTypes = await GetStatTypes();
            var statCategories = await GetStatCategories();

            long playerGameStatsImported = 0;
            try
            {
                _logger.LogInformation("Beginning import. This may take a while...");
                var dataTable = new DataTable("PLAYERGAMESTAT");
                dataTable.Columns.Add("STATVALUE", typeof(decimal));
                dataTable.Columns.Add("STATTYPE", typeof(int));
                dataTable.Columns.Add("STATCATEGORY", typeof(int));
                dataTable.Columns.Add("GAME", typeof(int));
                dataTable.Columns.Add("PLAYER", typeof(int));

                // work backwards to prioritize recent data
                // only go to 2014 because this is going to be insane amounts of data
                for (int season = DEFAULT_MAX_SEASON; season >= DEFAULT_MIN_SEASON; season--)
                {
                    dataTable.Clear();
                    long seasonStatsImported = 0;
                    _logger.LogInformation($"Beginning import for season: {season}");
                    for (int week = MIN_SEASON_WEEK; week <= MAX_SEASON_WEEK; week++)
                    {
                        // the 'both' actually works here for seasontype. yay
                        string queryUrl = $"games/players?year={season}&week={week}&seasonType=both";
                        var gameStats = (await _v1APIClient.GetFromJsonAsync<List<PlayerGameStatResponse>>(queryUrl))?.ToList() ?? new List<PlayerGameStatResponse>();
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
                                                seasonStatsImported++;
                                                playerGameStatsImported++;

                                                int statTypeId = 0;
                                                int categoryId = 0;
                                                if (statTypes.ContainsKey(type.Name))
                                                {
                                                    statTypeId = statTypes[type.Name];
                                                }
                                                else
                                                {
                                                    statTypeId = await _sqlCommandManager.InsertAndGetIdAsync<int>(new InsertStatType(type.Name));
                                                    statTypes.Add(type.Name, statTypeId);
                                                }

                                                if (statCategories.ContainsKey(category.Name))
                                                {
                                                    categoryId = statCategories[category.Name];
                                                }
                                                else
                                                {
                                                    categoryId = await _sqlCommandManager.InsertAndGetIdAsync<int>(new InsertStatCategory(category.Name));
                                                    statCategories.Add(category.Name, categoryId);
                                                }

                                                dataTable.Rows.Add(
                                                // null
                                                statValue,
                                                statTypeId,
                                                categoryId,
                                                game.Id,
                                                athlete.Id.GetValueOrDefault());
                                            }
                                        }
                                    }
                                }
                            }
                        }

                        if (dataTable.Rows.Count > 0)
                        {
                            var rowsInserted = _sqlCommandManager.BulkInsert(dataTable);
                            _logger.LogInformation($"Inserted {rowsInserted:N0} player game stats for week {week} of season {season}");
                        }
                        else
                        {
                            _logger.LogInformation($"No player game stats imported for week {week} of season {season}");
                        }
                    }
                    _logger.LogInformation($"Inserted {seasonStatsImported:N0} player game stats for season {season}");
                }
                _logger.LogInformation($"Inserted {playerGameStatsImported:N0} player game stats");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
        }
    }
}