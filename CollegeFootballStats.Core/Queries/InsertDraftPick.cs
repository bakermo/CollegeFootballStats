namespace CollegeFootballStats.Core.Queries
{
    public class InsertDraftPick : SqlCommandBase
    {
        public InsertDraftPick(int playerId, int collegeTeamId, string nflTeam, string position,
            int year, int round, int roundPick, int overallPick)
        {
            Parameters = new
            {
                DraftPickId = 0,
                PlayerId = playerId,
                CollegeTeam = collegeTeamId,
                NflTeam = nflTeam,
                Position = position,
                Year = year,
                Round = round,
                RoundPick = roundPick,
                OverallPick = overallPick
            };
        }

        public override string Text => @"
            INSERT INTO DraftPick
            (
                PlayerId,
                CollegeTeam,
                NflTeam,
                Position,
                Year,
                Round,
                RoundPick,
                OverallPick
            )
            VALUES
            (
                :PlayerId,
                :CollegeTeam,
                :NflTeam,
                :Position,
                :Year,
                :Round,
                :RoundPick,
                :OverallPick
            )
            RETURNING DraftPickId INTO :DraftPickId
        ";
    }
}
