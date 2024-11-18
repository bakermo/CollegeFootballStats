namespace CollegeFootballStats.Core.Queries
{
    public class InsertCoach : SqlCommandBase
    {
        public InsertCoach(string firstName, string lastName)
        {
            Parameters = new
            {
                CoachID = 0,
                FirstName = firstName,
                LastName = lastName
            };
        }
        public override string Text => @"
            INSERT INTO Coach
            (
                FirstName,
                LastName
            )
            VALUES
            (
                :FirstName,
                :LastName
            )
            RETURNING CoachID INTO :CoachID
        ";
    }
}
