using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Json;
using System.Text;
using System.Threading.Tasks;

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
                    _logger.LogInformation(team.Id + " " + team.School + " " + team.Abbreviation + " ");
                    //var query = new Query("INSERT INTO teams (id, school, mascot, abbreviation, conference, division, color, alt_color, logo) VALUES (:Id, :School, :Mascot, :Abbreviation, :Conference, :Division, :Color, :AltColor, :Logo)", team);
                    //await _queryManager.ExecuteAsync(query);
                }
                _logger.LogInformation("Teams fetched. Importing...");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message);
                throw;
            }
        }
    }
}
