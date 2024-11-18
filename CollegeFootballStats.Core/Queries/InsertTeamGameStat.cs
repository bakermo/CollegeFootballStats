namespace CollegeFootballStats.Core.Queries
{
    public class InsertTeamGameStat : SqlCommandBase
    {
        public InsertTeamGameStat(int gameId, int teamId, decimal statValue, string statCategory)
        {
            Parameters = new
            {
                StatId = 0,
                Game = gameId,
                Team = teamId,
                StatValue = statValue,
                StatCategory = statCategory
            };
        }

        public override string Text => @"
            INSERT INTO TeamGameStat(
                Game,
                Team,
                StatValue,
                StatCategory
            )
            VALUES(
                :Game,
                :Team,
                :StatValue,
                :StatCategory
            )   
            RETURNING StatID INTO :StatID
        ";
    }
}
