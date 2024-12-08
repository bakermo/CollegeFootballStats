namespace CollegeFootballStats.Core.Queries
{
    public class GetAllCoaches : SqlCommandBase
    {
        public override string Text => @"
            SELECT
                *   
            FROM    
                Coach c";
    }
}