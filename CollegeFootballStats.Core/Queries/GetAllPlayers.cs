namespace CollegeFootballStats.Core.Queries
{
    public class GetAllPlayers : SqlCommandBase
    {
        public override string Text => @"
            SELECT
                *
            FROM    
                Player
        ";
    }
}
