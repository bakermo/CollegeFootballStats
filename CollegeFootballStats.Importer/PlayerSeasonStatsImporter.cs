using CollegeFootballStats.Core.Models;
using CollegeFootballStats.Core.Queries;
using Microsoft.Extensions.Logging;
using System.Data;
using System.Net.Http.Json;

namespace CollegeFootballStats.Importer
{
    internal class PlayerSeasonStatsImporter : BaseImporter
    {
        public PlayerSeasonStatsImporter(ImporterConfig config, ILogger logger) : base(config, logger)
        {
        }

        public override async Task ImportAsync()
        {
            var getAllPlayersCommand = new GetAllPlayers();
            var players = (await _sqlCommandManager.QueryAsync<Player>(getAllPlayersCommand))
                .Select(p => p.PlayerID)
                .ToHashSet();
            
            if (players.Count == 0)
            {
                _logger.LogError("No players found in database! Players are required to import player season stats. Please import players first!");
            }

            _logger.LogInformation($"Found {players.Count} players in database");
            long playerStatsImported = 0;
            try
            {
                _logger.LogInformation("Beginning import. This may take a while...");
                // work backwards to prioritize recent data

                var dataTable = new DataTable("PLAYERSEASONSTAT");
                //dataTable.Columns.Add("STATID", typeof(int));
                dataTable.Columns.Add("STATVALUE", typeof(decimal));
                dataTable.Columns.Add("STATTYPE", typeof(string));
                dataTable.Columns.Add("STATCATEGORY", typeof(string));
                dataTable.Columns.Add("SEASON", typeof(int));
                dataTable.Columns.Add("PLAYER", typeof(int));

                for (int season = DEFAULT_MAX_SEASON; season >= DEFAULT_MIN_SEASON; season--)
                {
                    dataTable.Clear();
                    _logger.LogInformation($"Beginning import for season: {season}");
                    string queryUrl = $"stats/player/season?year={season}";
                    var playerSeasonStats = (await _v1APIClient.GetFromJsonAsync<List<PlayerSeasonStatResponse>>(queryUrl))?
                        .ToList() ?? new List<PlayerSeasonStatResponse>();

                    _logger.LogInformation($"Found {playerSeasonStats?.Count ?? 0:N0} for season {season}");

                    long seasonStatsImported = 0;

                    foreach (var stat in playerSeasonStats)
                    {
                        if (decimal.TryParse(stat.Stat, out decimal statValue) && players.Contains(stat.PlayerId.GetValueOrDefault()))
                        {
                            seasonStatsImported++;
                            playerStatsImported++;

                            dataTable.Rows.Add(
                                //null, 
                                statValue,
                                stat.StatType,
                                stat.Category,
                                season,
                                stat.PlayerId.GetValueOrDefault());
                        }
                    }

                    if (dataTable.Rows.Count > 0)
                    {
                        var rowsInserted = _sqlCommandManager.BulkInsert(dataTable);
                        _logger.LogInformation($"Inserted {rowsInserted:N0} player season stats for season {season}");
                    }
                    else
                    {
                        _logger.LogInformation($"No player season stats imported for season {season}");
                    }
                }

                _logger.LogInformation($"Imported {playerStatsImported:N0} player season stats");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
        }
    }
}
