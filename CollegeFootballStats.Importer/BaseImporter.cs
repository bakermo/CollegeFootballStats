using CollegeFootballStats.Core;
using CollegeFootballStats.Core.Models;
using CollegeFootballStats.Core.Queries;
using Microsoft.Extensions.Logging;

namespace CollegeFootballStats.Importer
{
    internal abstract class BaseImporter
    {
        protected readonly HttpClient _httpClient;
        protected readonly SqlCommandManager _sqlCommandManager;
        protected readonly ILogger _logger;
        protected const int DEFAULT_MIN_SEASON = 2000;
        protected const int DEFAULT_MAX_SEASON = 2024;

        public BaseImporter(ImporterConfig config, ILogger logger)
        {
            _logger = logger;
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri(config.ApiUrl);
            _httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + config.ApiKey);
            _sqlCommandManager = new SqlCommandManager(config.ConnectionString);
        }

        public abstract Task ImportAsync();

        protected async Task<Dictionary<string, int>> GetUniqueTeamsFromDatabase()
        {
            _logger.LogInformation("Fetching existing teams from database...");
            // The API is going to give us the school name, but we need the team id
            // We also need the team id to respect the FK constraint on the coaching record table
            // So as long as we have the teams in the database, we can look them up
            var teams = (await _sqlCommandManager.QueryAsync<Team>(new GetTeams()))
              .GroupBy(t => t.School)
              // ugh, we have to do this dumb grouping because there are a handful of schools/teams
              // that show up in the database multiple times. it seems to be the most reliable way of 
              // dealing with this is grab the earliest id, as its most likely to actually be populated.
              // I may deal with this later with the team importer and remport teams. for now we have to
              // do this dumbassery
              .ToDictionary(g => g.Key, g => g.OrderBy(t => t.TeamId).First().TeamId);

            return teams;
        }
    }
}
