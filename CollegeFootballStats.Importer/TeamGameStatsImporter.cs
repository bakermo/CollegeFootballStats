
using CollegeFootballStats.Core.Models;
using CollegeFootballStats.Core.Queries;
using Microsoft.Extensions.Logging;
using System.Data;
using System.Net.Http.Json;

namespace CollegeFootballStats.Importer
{
    internal class TeamGameStatsImporter : BaseImporter
    {
        public TeamGameStatsImporter(ImporterConfig config, ILogger logger) : base(config, logger)
        {
        }

        public override async Task ImportAsync()
        {
            var teamsImported = await TableHasRecords(TEAMS_TABLE);
            if (!teamsImported)
            {
                _logger.LogError("No teams found in database! Teams are required to import team game stats. Please import teams first!");
                return;
            }

            var gamesImported = await TableHasRecords(GAMES_TABLE);
            if (!gamesImported)
            {
                _logger.LogError("No games found in database! Games are required to import team game stats. Please import games first!");
                return;
            }

            var statCategories = await GetStatCategories();

            long teamGameStatsImported = 0;
            try
            {
                _logger.LogInformation("Beginning import. This may take a while...");
                var dataTable = new DataTable("TEAMGAMESTAT");
                //dataTable.Columns.Add("STATID", typeof(int));
                dataTable.Columns.Add("STATVALUE", typeof(decimal));
                dataTable.Columns.Add("STATCATEGORY", typeof(int));
                dataTable.Columns.Add("GAME", typeof(int));
                dataTable.Columns.Add("TEAM", typeof(int));

                for (int season = DEFAULT_MAX_SEASON; season >= DEFAULT_MIN_SEASON; season--)
                {
                    _logger.LogInformation($"Beginning import for season: {season}");
                    long seasonStatsImported = 0;
                    for (int week = MIN_SEASON_WEEK; week <= MAX_SEASON_WEEK; week++)
                    {
                        dataTable.Clear();
                        var allGames = new List<TeamGameStatResponse>();
                        // we can't use 'both' for seeason type on this endpoint, throws an error
                        // so unfortunately I have to fetch both
                        string queryUrl = $"games/teams?year={season}&week={week}";
                        var regularSeasonGames = await _v1APIClient.GetFromJsonAsync<List<TeamGameStatResponse>>($"{queryUrl}&seasonType=regular");
                        _logger.LogInformation($"Found stats for {regularSeasonGames?.Count ?? 0} regular season games for week {week} of season {season}");
                        var postSeasonGames = await _v1APIClient.GetFromJsonAsync<List<TeamGameStatResponse>>($"{queryUrl}&seasonType=postseason");
                        _logger.LogInformation($"Found stats for {postSeasonGames?.Count ?? 0} post season games for week {week} of season {season}");

                        allGames.AddRange(regularSeasonGames?.ToList() ?? new List<TeamGameStatResponse>());
                        allGames.AddRange(postSeasonGames?.ToList() ?? new List<TeamGameStatResponse>());

                        foreach (var game in allGames)
                        {
                            // should only be 2 teams
                            foreach (var team in game.Teams)
                            {
                                // will be several stats for each team
                                // so O(n^bajillion) but we 're not going to have that many stats
                                foreach (var stat in team.Stats)
                                {
                                    // We only want stats that we can parse into an aggregatable value
                                    // some stats like possession time or third down efficiency stay as strings
                                    // I could make another column for them, but Im thinking we just don't bother
                                    if (decimal.TryParse(stat.Stat, out decimal statValue))
                                    {
                                        seasonStatsImported++;
                                        teamGameStatsImported++;

                                        int categoryId = 0;
                                        if (statCategories.ContainsKey(stat.Category))
                                        {
                                            categoryId = statCategories[stat.Category];
                                        }
                                        else
                                        {
                                            categoryId = await _sqlCommandManager.InsertAndGetIdAsync<int>(new InsertStatCategory(stat.Category));
                                            statCategories.Add(stat.Category, categoryId);
                                        }

                                        dataTable.Rows.Add(
                                            //null, 
                                            statValue,
                                            categoryId,
                                            game.Id,
                                            team.SchoolId);
                                    }
                                }
                            }
                        }

                        if (dataTable.Rows.Count > 0)
                        {
                            var rowsInserted = _sqlCommandManager.BulkInsert(dataTable);
                            _logger.LogInformation($"Inserted {rowsInserted:N0} team game stats for week {week} of season {season}");
                        }
                        else
                        {
                            _logger.LogInformation($"No team game stats imported for week {week} of season {season}");
                        }
                    }
                    _logger.LogInformation($"Finished import for season: {season} with {seasonStatsImported:N0} stats");
                }
                _logger.LogInformation($"Imported {teamGameStatsImported:N0} team game stats");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }

        }
    }
}
