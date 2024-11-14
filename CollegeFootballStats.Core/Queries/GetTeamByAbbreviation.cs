namespace CollegeFootballStats.Core.Queries
{
    public class GetTeamByAbbreviation : SqlCommandBase
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
