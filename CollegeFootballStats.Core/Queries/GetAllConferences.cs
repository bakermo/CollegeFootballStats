namespace CollegeFootballStats.Core.Queries
{
    public class GetAllConferences : SqlCommandBase
    {
        public GetAllConferences()
        {
        }

        public override string Text => @"
            SELECT
                *
            FROM
                Conference
        ";
    }
}
