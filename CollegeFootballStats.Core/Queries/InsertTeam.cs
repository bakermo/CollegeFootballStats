namespace CollegeFootballStats.Core.Queries
{
    public class InsertTeam : SqlCommandBase
    {
        public InsertTeam(int teamId, string school, string? abbreviation)
        {
            Parameters = new
            {
                TeamId = teamId,
                School = school,
                Abbreviation = abbreviation
            };
        }
        public override string Text => @"
            INSERT INTO Team
            (
                TeamId,
                School,
                Abbreviation
            )
            VALUES
            (
                :TeamId,
                :School,
                :Abbreviation
            )
        ";
    }
}
