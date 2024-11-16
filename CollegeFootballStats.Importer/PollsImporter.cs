using CollegeFootballStats.Core.Models;
using CollegeFootballStats.Core.Queries;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;

namespace CollegeFootballStats.Importer
{
    internal class PollsImporter : BaseImporter
    {
        public PollsImporter(ImporterConfig config, ILogger logger) : base(config, logger)
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

            _logger.LogInformation("Fetching polls from API...");

            try
            {
                for (int i = DEFAULT_MIN_SEASON; i <= DEFAULT_MAX_SEASON; i++)
                {
                    var response = await _httpClient.GetFromJsonAsync<List<PollResponse>>($"rankings?year={i}&seasonType=both");
                    _logger.LogInformation($"Fetched {response.Count} regular and postseason polls for {i} Season: ");
                    foreach (var pollResponse in response)
                    {
                        foreach (var poll in pollResponse.Polls)
                        {
                            foreach (var ranking in poll.Ranks)
                            {
                                _logger.LogInformation($"Processing ranking: {ranking.School} with rank {ranking.Rank}");

                                if (!teams.ContainsKey(ranking.School))
                                {
                                    _logger.LogWarning($"School {ranking.School} not found in database! Skipping ranking...");
                                    continue;
                                }

                                var teamId = teams[ranking.School];
                                _logger.LogInformation($"Found team {ranking.School} with TeamID: {teamId}");

                                var insertPollCommand = new InsertPoll(poll.Poll, teamId, pollResponse.Season, pollResponse.Week, ranking.Rank, pollResponse.SeasonType == "postseason");
                                int pollId = await _sqlCommandManager.InsertAndGetIdAsync<int>(insertPollCommand, "PollID");

                                _logger.LogInformation($"INSERTED Poll: {pollId} Name: {poll.Poll} teamID: {teamId} Season: {pollResponse.Season} Week: {pollResponse.Week} Rank: {ranking.Rank} Season Type: {pollResponse.SeasonType}");
                            }
                        }
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