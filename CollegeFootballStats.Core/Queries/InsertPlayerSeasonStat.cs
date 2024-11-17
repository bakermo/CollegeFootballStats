namespace CollegeFootballStats.Core.Queries
{
    public class InsertPlayerSeasonStat : SqlCommandBase
    {
        public InsertPlayerSeasonStat(int playerId, int seasonId, decimal statValue, string statCategory, string statType)
        {
            Parameters = new
            {
                StatId = 0,
                Player = playerId,
                Season = seasonId,
                StatValue = statValue,
                StatCategory = statCategory,
                StatType = statType
            };
        }
        public override string Text => @"
            INSERT INTO PlayerSeasonStat(
                Player,
                Season,
                StatValue,
                StatCategory,
                StatType
            )
            VALUES(
                :Player,
                :Season,
                :StatValue,
                :StatCategory,
                :StatType
            )
            RETURNING StatID INTO :StatID
        ";
    }
}
