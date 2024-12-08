namespace CollegeFootballStats.Core.Queries
{
    public class InsertRecruitingPlayer : SqlCommandBase
    {
        public InsertRecruitingPlayer(int? athleteID, string name, int year, int? ranking, string committedTo, int stars, decimal rating)
        {
            Parameters = new
            {
                AthleteID = athleteID,
                Name = name,
                Year = year,
                Ranking = ranking,
                CommittedTo = committedTo,
                Stars = stars,
                Rating = rating
            };
        }

        public override string Text => @"
            INSERT INTO RecruitingPlayers (AthleteID, Name, Year, Ranking, CommittedTo, Stars, Rating)
            VALUES (:AthleteID, :Name, :Year, :Ranking, :CommittedTo, :Stars, :Rating)";
    }
}