namespace CollegeFootballStats.Core.Queries
{
    public class GetTeamsByConference : SqlCommandBase
    {
        public GetTeamsByConference(int conferenceId)
        {
            Parameters = new
            {
                ConferenceID = conferenceId
            };
        }

        public override string Text => @"
            SELECT DISTINCT
                t.TeamID,
                t.School,
                t.Abbreviation
            FROM Team t
            JOIN ConferenceMembership cm ON t.TeamID = cm.TeamID
            WHERE cm.ConferenceID = :ConferenceID
                AND cm.Year = 2024  -- Current conference alignment
            ORDER BY t.School";
    }
}