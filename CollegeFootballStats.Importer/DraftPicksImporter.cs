using CollegeFootballStats.Core.Models;
using CollegeFootballStats.Core.Queries;
using Microsoft.Extensions.Logging;
using System.Net.Http.Json;

namespace CollegeFootballStats.Importer
{
    internal class DraftPicksImporter : BaseImporter
    {
        public DraftPicksImporter(ImporterConfig config, ILogger logger) : base(config, logger)
        {
        }

        public override async Task ImportAsync()
        {
            var teams = await GetUniqueTeamsFromDatabase();

            if (teams.Count == 0)
            {
                _logger.LogError("No teams found in database! Teams are required to import draft picks. Please import teams first!");
            }

            _logger.LogInformation($"Found {teams.Count} teams in the database");

            _logger.LogInformation("Fetching players from database...");
            var players = (await _sqlCommandManager.QueryAsync<Player>(new GetAllPlayers()))
                .Select(x => x.PlayerID)
                .ToHashSet();

            if (players.Count == 0)
            {
                _logger.LogError("No players found in database! Players are required to import draft picks. Please import players first!");
            }

            _logger.LogInformation($"Found {players.Count} teams in the database");

            try
            {
                for (int season = DEFAULT_MIN_SEASON; season <= DEFAULT_MAX_SEASON; season++)
                {
                    _logger.LogInformation($"Fetching draft picks for {season}...");
                    var response = await _v1APIClient.GetFromJsonAsync<List<DraftPickResponse>>($"draft/picks?year={season}");

                    _logger.LogInformation($"Fetched {response.Count} draft picks for {season}");

                    foreach (var pick in response)
                    {
                        // Yes, somehow the ID can be null or < 0, likely for if the draft pick
                        // wasn't from college. Its also possible the draft pick will be from a previous
                        // year's roster that we didn't import or the api didn't have roster infromation for.
                        // In either case, we don't know who it is, so skip it
                        int playerID = pick.CollegeAthleteId.GetValueOrDefault();
                        if (playerID > 0 && players.Contains(playerID))
                        {

                            _logger.LogInformation($"INSERTED DRAFT PICK: PlayerID: {pick.CollegeAthleteId} Name: {pick.Name} CollegeTeam: {pick.CollegeTeam}" +
                             $" NFLTeam: {pick.NFLTeam} Position: {pick.Position} Year: {pick.Year} Round: {pick.Round} RoundPick: {pick.Pick} Overall: {pick.Overall}");

                            var command = new InsertDraftPick(pick.CollegeAthleteId.GetValueOrDefault(), pick.CollegeId, pick.NFLTeam, pick.Position,
                                pick.Year, pick.Round, pick.Pick, pick.Overall);
                            await _sqlCommandManager.ExecuteAsync(command);

                         
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
