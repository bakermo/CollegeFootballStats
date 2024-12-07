namespace CollegeFootballStats.Core.Queries
{
    public class CheckRecruitingPlayerExists : SqlCommandBase
    {
        public CheckRecruitingPlayerExists(int athleteID)
        {
            Parameters = new { AthleteID = athleteID };
        }

        public override string Text => @"
            SELECT COUNT(1)
            FROM RecruitingPlayers
            WHERE AthleteID = :AthleteID";
    }
}