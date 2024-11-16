using CollegeFootballStats.Core.Queries;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;


namespace CollegeFootballStats.Importer
{
    internal class ConferencesImporter : BaseImporter
    {
        public ConferencesImporter(ImporterConfig config, ILogger logger) : base(config, logger)
        {
        }

        public override async Task ImportAsync()
        {
            _logger.LogInformation("Fetching conferences from API...");

            try
            {
                var response = await _httpClient.GetFromJsonAsync<List<ConferenceResponse>>("conferences");

                if (response == null)
                {
                    _logger.LogWarning("No conferences fetched. Exiting...");
                    return;
                }

                _logger.LogInformation($"Fetched {response.Count} conferences");

                foreach (var conference in response)
                {
                    var command = new InsertConference(conference.Id, conference.Name, conference.Short_Name, conference.Classification, conference.Abbreviation);
                    await _sqlCommandManager.ExecuteAsync(command);
                    _logger.LogInformation("INSERTED CONFERENCE:" + conference.Id + " " + conference.Name + " " + conference.Short_Name + " " + conference.Classification + " " + conference.Abbreviation);
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
