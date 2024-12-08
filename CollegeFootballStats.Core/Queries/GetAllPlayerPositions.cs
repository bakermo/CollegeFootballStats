namespace CollegeFootballStats.Core.Queries
{
    public class GetAllPlayerPositions : SqlCommandBase
    {
        public override string Text => @"
            SELECT DISTINCT p.Position
            FROM Player p
            JOIN DraftPick dp ON p.PlayerID = dp.PlayerID
            WHERE dp.Year BETWEEN 2000 AND 2024
              AND p.Position IS NOT NULL
              AND p.Position <> '?'
            ORDER BY p.Position";
    }
}