namespace CollegeFootballStats.Core.Queries
{
    public class GetTeams : SqlCommandBase
    {
        public override string Text => @"
            SELECT
                *   
            FROM    
                Team t";
    }
}
