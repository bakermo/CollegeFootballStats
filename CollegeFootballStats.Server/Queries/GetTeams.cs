namespace CollegeFootballStats.Server.Queries
{
    public class GetTeams : QueryBase
    {
        public override string Text => @"
            SELECT
                *   
            FROM    
                Team t";
    }
}
