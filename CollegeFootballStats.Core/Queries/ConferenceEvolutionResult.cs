namespace CollegeFootballStats.Core.Models
{
    public class ConferenceEvolutionResult
    {
        public string Name { get; set; } = string.Empty; // Will be either conference name or team name
        public int Season { get; set; }
        public decimal AvgPointsScored { get; set; }
        public decimal AvgPointsAllowed { get; set; }
        public decimal PointDifferential { get; set; }
        public int TeamCount { get; set; }
    }
}