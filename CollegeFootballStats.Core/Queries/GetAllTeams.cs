namespace CollegeFootballStats.Core.Queries
{
    public class GetAllTeams : SqlCommandBase
    {
        public override string Text => @"
            SELECT
                *   
            FROM    
                Team t";
    }
}
