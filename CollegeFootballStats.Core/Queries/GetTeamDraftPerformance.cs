namespace CollegeFootballStats.Core.Queries
{
    public class GetTeamDraftPerformance : SqlCommandBase
    {
        private readonly int _teamId;
        private readonly int _conferenceId;
        private readonly int _startSeason;
        private readonly int _endSeason;

        public GetTeamDraftPerformance(int teamId, int conferenceId, int startSeason, int endSeason)
        {
            _teamId = teamId;
            _conferenceId = conferenceId;
            _startSeason = startSeason;
            _endSeason = endSeason;
        }

        public override string Text => @"
            SELECT DISTINCT
                t.School AS Team,
                p.Season,
                p.Rank,
                dp.OverallPick
            FROM
                Poll p
                JOIN Team t ON p.TeamID = t.TeamID
                JOIN DraftPick dp ON t.TeamID = dp.CollegeTeam
                JOIN ConferenceMembership cm ON t.TeamID = cm.TeamID AND cm.Year = p.Season
                JOIN Conference c ON cm.ConferenceID = c.ConferenceID
            WHERE
                (:teamId IS NULL OR t.TeamID = :teamId)
                AND (:conferenceId IS NULL OR c.ConferenceID = :conferenceId)
                AND p.Season BETWEEN :startSeason AND :endSeason
            ORDER BY
                p.Season, p.Rank, dp.OverallPick
        ";

        public override object Parameters => new
        {
            teamId = _teamId,
            conferenceId = _conferenceId,
            startSeason = _startSeason,
            endSeason = _endSeason
        };
    }
}