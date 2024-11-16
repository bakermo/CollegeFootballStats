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
            var teams = await GetUniqueTeamsFromDatabase();

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
