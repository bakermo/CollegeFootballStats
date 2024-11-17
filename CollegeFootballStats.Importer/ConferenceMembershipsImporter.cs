using CollegeFootballStats.Core.Models;
using CollegeFootballStats.Core.Queries;
using Microsoft.Extensions.Logging;
using System.Data;
using System.Net.Http.Json;

namespace CollegeFootballStats.Importer
{
    internal class ConferenceMembershipsImporter : BaseImporter
    {
        public ConferenceMembershipsImporter(ImporterConfig config, ILogger logger) : base(config, logger)
        {
        }

        public override async Task ImportAsync()
        {
            var conferences = (await _sqlCommandManager.QueryAsync<Conference>(new GetAllConferences()))?
                .GroupBy(t => (t.ShortName, t.Classification)) // obnoxious, but there are some with the same short name
                .ToDictionary(c => c.Key, c=> c.OrderBy(x => x.ConferenceId).First().ConferenceId) ?? new Dictionary<(string shortName, string division), int>();

            if (conferences?.Count == 0)
            {
                _logger.LogError("No conferences found in database! Conferences are required to import conference memberships. Please import conferences first!");
                return;
            }

            var teams = (await _sqlCommandManager.QueryAsync<Team>(new GetAllTeams()))?
                .ToDictionary(t => t.TeamId, t => t.TeamId) ?? new Dictionary<int, int>();

            if (teams.Count == 0)
            {
                _logger.LogError("No teams found in database! Teams are required to import conference memberships. Please import teams first!");
                return;
            }

            _logger.LogInformation($"Found {teams.Count} teams in the database");
            
           
            _logger.LogInformation("Fetching teams from API...");

            try
            {
                var dataTable = new DataTable("CONFERENCEMEMBERSHIP");
                dataTable.Columns.Add("YEAR", typeof(int));
                dataTable.Columns.Add("TEAMID", typeof(int));
                dataTable.Columns.Add("CONFERENCEID", typeof(int));

                long conferenceMembershipsImported = 0;
                for (int season = DEFAULT_MIN_SEASON; season <= DEFAULT_MAX_SEASON; season++)
                {
                    long seasonConferenceMembershipsImported = 0;
                    string queryUrl = $"teams?year={season}";
                    var response = (await _v2APIClient.GetFromJsonAsync<List<TeamResponse>>(queryUrl))?
                        .ToList() ?? new List<TeamResponse>();

                    _logger.LogInformation($"Fetched {response.Count} teams for season {season}");

                    foreach (var team in response)
                    {
                        // we don't bother if we don't know who the team is or if they didn't
                        // give us both the conference and division
                        if (teams.ContainsKey(team.Id) && !string.IsNullOrEmpty(team.Conference) && !string.IsNullOrEmpty(team.Classification))
                        {
                            var conferenceId = conferences[(team.Conference, team.Classification)];
                            dataTable.Rows.Add(season, team.Id, conferenceId);
                            seasonConferenceMembershipsImported++;
                            conferenceMembershipsImported++;
                        }
                    }

                    if (dataTable.Rows.Count > 0)
                    {
                        var rowsInserted = _sqlCommandManager.BulkInsert(dataTable);
                        _logger.LogInformation($"Inserted {rowsInserted:N0} conference memberships for season {season}");
                    }
                    else
                    {
                        _logger.LogInformation($"No conference memberships imported for season {season}");
                    }
                }
                _logger.LogInformation($"Inserted {conferenceMembershipsImported:N0} conference memberships");
            }

            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
        }
    }
}
