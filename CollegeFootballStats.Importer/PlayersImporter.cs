using CollegeFootballStats.Core.Queries;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;

namespace CollegeFootballStats.Importer
{
    // Imports players and rosters
    internal class PlayersImporter : BaseImporter
    {
        public PlayersImporter(ImporterConfig config, ILogger logger) : base(config, logger)
        {
        }

        public override async Task ImportAsync()
        {
            var teams = await GetUniqueTeamsFromDatabase();

            if (teams.Count == 0)
            {
                _logger.LogError("No teams found in database! Teams are required to import players and rosters. Please import teams first!");
                return;
            }

            _logger.LogInformation($"Found {teams.Count} teams in the database");

            try
            {
                _logger.LogInformation("Fetching rosters from API...");
                for (int season = DEFAULT_MIN_SEASON; season <= DEFAULT_MAX_SEASON; season++)
                {
                    var response = await _httpClient.GetFromJsonAsync<List<RosterResponse>>($"roster?year={season}");

                    if (response == null)
                    {
                        _logger.LogWarning("No players fetched. Exiting...");
                        return;
                    }

                    _logger.LogInformation($"Fetched {response.Count} players on rosters in Season: {season}");

                    foreach (var player in response)
                    {
                        if (!teams.ContainsKey(player.Team))
                        {
                            _logger.LogWarning($"Team {player.Team} not found in database!. Skipping roster...");
                            continue;
                        }

                        var teamId = teams[player.Team];

                        var command = new InsertPlayerAndRoster(player.Id, player.First_Name, player.Last_Name, player.Position,
                            player.Weight, player.Height, player.Jersey, player.Height, teamId, season);

                        await _sqlCommandManager.ExecuteAsync(command);

                        _logger.LogInformation($"INSERTED PLAYER/ROSTER: PlayerID: {player.Id} First Name: {player.First_Name} Last Name: {player.Last_Name} " +
                            $" Height: {player.Height} Weight: {player.Weight} Jersey {player.Jersey} Year: {player.Year}" +
                            $" Position: {player.Position} Team: {player.Team} Season: {season}");
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
