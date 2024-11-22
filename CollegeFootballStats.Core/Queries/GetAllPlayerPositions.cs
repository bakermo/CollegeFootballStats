namespace CollegeFootballStats.Core.Queries
{
    public class GetAllPlayerPositions : SqlCommandBase
    {
        public override string Text => @"
            SELECT DISTINCT
                Position   
            FROM    
                Player
            WHERE
                Position IS NOT NULL AND LENGTH(TRIM(Position)) > 0 AND Position <> '?'";
    }
}