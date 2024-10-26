namespace CollegeFootballStats.Server.Queries
{
    public class GetTeamByAbbreviation : QueryBase
    {
        public GetTeamByAbbreviation(string abbreviation)
        {
            Parameters = new
            {
                Abbreviation = abbreviation
            };
        }
    
        public override string Text => @"
            SELECT
                *   
            FROM    
                Team t
            WHERE
                t.Abbreviation = :Abbreviation";
    }
}
