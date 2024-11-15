using CollegeFootballStats.Core.Models;
using CollegeFootballStats.Core.Queries;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;

namespace CollegeFootballStats.Importer
{
    internal class CoachesImporter : BaseImporter
    {
        public CoachesImporter(ImporterConfig config, ILogger logger) : base(config, logger)
        {
        }

        public override async Task ImportAsync()
        {
            _logger.LogInformation("Fetching exiting teams from database...");
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

            if (teams.Count == 0)
            {
                _logger.LogError("No teams found in database! We pull from the database to save API calls. Please import teams first!");
                return;
            }

            _logger.LogInformation($"Found {teams.Count} teams in the database");

            _logger.LogInformation("Fetching coaches from API...");
            try
            {
                var response = await _httpClient.GetFromJsonAsync<List<CoachResponse>>("coaches?minYear=2000&maxYear=2024");
                if (response == null)
                {
                    _logger.LogWarning("No coaches fetched. Exiting...");
                    return;
                }

                _logger.LogInformation($"Fetched {response.Count} coaches");

                _logger.LogInformation("Truncating COACHING_RECORDS and COACHES tables...");
                await _sqlCommandManager.TruncateTable("COACHINGRECORD");
                await _sqlCommandManager.TruncateTable("COACH");

                _logger.LogInformation("Tables truncated...");

                foreach (var coach in response)
                {
                    var insertCoachCommand = new InsertCoach(coach.First_Name, coach.Last_Name);

                    // Ok the API doesn't give us a coach id, presumably because it isn't used elsewhere,
                    // so we need to generate our own
                    int coachId = await _sqlCommandManager.InsertAndGetIdAsync<int>(insertCoachCommand, "CoachID");
                    _logger.LogInformation($"INSERTED COACH: {coach.First_Name} {coach.Last_Name} WITH ID: {coachId}");

                    foreach (var season in coach.Seasons)
                    {
                        if (!teams.ContainsKey(season.School))
                        {
                            _logger.LogWarning($"School {season.School} not found in database!. Skipping season...");
                            continue;
                        }

                        var teamID = teams[season.School];
                        var insertCoachingRecordCommand = new InsertCoachingRecord(coachId, teamID, season.Year, season.Games, season.Wins, season.Losses, season.Ties);
                        await _sqlCommandManager.ExecuteAsync(insertCoachingRecordCommand);
                        _logger.LogInformation($"INSERTED RECORD FOR SEASON: Season: {season.Year} School:{season.School} Games: {season.Games} Wins: {season.Wins} Losses: {season.Losses} Ties: {season.Ties}");
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
