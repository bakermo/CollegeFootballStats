using CollegeFootballStats.Core.Models;
using CollegeFootballStats.Core.Queries;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;

namespace CollegeFootballStats.Importer
{
    internal class RecruitingPlayersImporter : BaseImporter
    {
        public RecruitingPlayersImporter(ImporterConfig config, ILogger logger) : base(config, logger)
        {
        }

        public override async Task ImportAsync()
        {
            _logger.LogInformation("Fetching recruiting players from API...");

            try
            {
                for (int season = DEFAULT_MIN_SEASON; season <= DEFAULT_MAX_SEASON; season++)
                {
                    _logger.LogInformation($"Fetching recruiting players for {season}...");
                    var response = await _v1APIClient.GetFromJsonAsync<List<RecruitingPlayerResponse>>($"recruiting/players?year={season}");

                    _logger.LogInformation($"Fetched {response.Count} recruiting players for {season}");

                    foreach (var player in response)
                    {
                        // Skip players without a valid Athlete ID
                        if (!player.AthleteID.HasValue || player.AthleteID <= 0)
                        {
                            _logger.LogWarning($"Skipping player without valid Athlete ID: {player.Name}");
                            continue;
                        }

                        // Check if the player already exists in the database
                        var existingPlayer = await _sqlCommandManager.QueryFirstOrDefault<int>(new CheckRecruitingPlayerExists(player.AthleteID.Value));
                        if (existingPlayer > 0)
                        {
                            _logger.LogWarning($"Skipping duplicate player: AthleteID: {player.AthleteID} Name: {player.Name}");
                            continue;
                        }

                        _logger.LogInformation($"INSERTED RECRUITING PLAYER: AthleteID: {player.AthleteID} Name: {player.Name} Year: {player.Year} Ranking: {player.Ranking} " +
                            $"CommittedTo: {player.CommittedTo} Stars: {player.Stars} Rating: {player.Rating}");

                        var command = new InsertRecruitingPlayer(player.AthleteID, player.Name, player.Year, player.Ranking, player.CommittedTo, player.Stars, player.Rating);
                        await _sqlCommandManager.ExecuteAsync(command);
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