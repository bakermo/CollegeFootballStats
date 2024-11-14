using CollegeFootballStats.Core.Queries;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;


namespace CollegeFootballStats.Importer
{
    internal class TeamsImporter : BaseImporter
    {
        public TeamsImporter(ImporterConfig config, ILogger logger) : base(config, logger)
        {
        }

        public override async Task ImportAsync()
        {
            _logger.LogInformation("Fetching teams from API...");

            try
            {
                var response = await _httpClient.GetFromJsonAsync<List<TeamResponse>>("teams");

                if (response == null)
                {
                    _logger.LogWarning("No teams fetched. Exiting...");
                    return;
                }

                _logger.LogInformation($"Fetched {response.Count} teams");

                foreach (var team in response)
                {
                    var command = new InsertTeam(team.Id, team.School, team.Abbreviation);
                    await _sqlCommandManager.ExecuteAsync(command);
                    _logger.LogInformation("INSERTED TEAM:" + team.Id + " " + team.School + " " + team.Abbreviation);
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
