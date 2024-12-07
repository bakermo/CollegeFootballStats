using System.Security.Cryptography.X509Certificates;
using System.Xml.Linq;

namespace CollegeFootballStats.Core.Models
{
    public class Player
    {
        public int PlayerID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public int? Weight { get; set; }
        public int? Height { get; set; }
        public int? Jersey { get; set; }
        // Year is the school year (1-4), not season
        public int? Year { get; set; }
    }

    public class Team
    {
        public int TeamId { get; set; }
        public string School { get; set; } = string.Empty;
        public string Abbreviation { get; set; } = string.Empty;
    }

    public class Conference
    {
        public int ConferenceId { get; set; }
        public string ShortName { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Classification { get; set; } = string.Empty;
        public string Abbreviation { get; set; } = string.Empty;
    }

    public class StatCategory
    {
        public int Id { get; set; }
        public string Category { get; set; } = string.Empty;
    }

    public class StatType
    {
        public int Id { get; set; }
        public string Type { get; set; } = string.Empty;
    }
    public class TeamRecruitingAndDraftResult
    {
        public string TeamName { get; set; }
        public int DraftYear { get; set; }
        public int DraftRound { get; set; }
        public int DraftRoundPick { get; set; }
        public int DraftOverallPick { get; set; }
        public string PlayerPosition { get; set; }
        public string PlayerFirstName { get; set; }
        public string PlayerLastName { get; set; }
        public string PlayerName => $"{PlayerFirstName} {PlayerLastName}";
        public int PlayerSeason { get; set; }
        public double? PlayerStatValue { get; set; }
        public string TeamRankPoll { get; set; }
        public int TeamRank { get; set; }
        public int TeamRankSeason { get; set; }
    }

    public class TeamDraftPerformance
    {
        public int TeamId { get; set; }
        public int Season { get; set; }
        public int Rank { get; set; }
        public int OverallPick { get; set; }
    }
    public class Coach
    {
        public int CoachID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
    }

    public class CoachingImpactResult
    {
        public int CoachID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string School { get; set; } = string.Empty;
        public int Year { get; set; }
        public decimal WinPercentage { get; set; }
        public int APRank { get; set; }
        public int CoachesPollRank { get; set; }
        public int PlayerCommitterRank { get; set; }
    }

    public class PlayerImpactResult
    {
        public int PlayerID { get; set; }
        public int GameID { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public int StatValue { get; set; }
        public int Season { get; set; }
        public decimal WinPercentage { get; set; }
        public int Week { get; set; }
        public int isPostSeason { get; set; }
        public int APTop25Rank { get; set; }
        public int CoachesPollRank { get; set; }
        public int PlayoffCommitteeRank { get; set; }
    }

    public class PlayerPosition
    {
        public string Position { get; set; } = string.Empty;
    }

    public class PercentilePerformanceResult
    {
        public int Percentile { get; set; }
        public int DraftYear { get; set; }
        public decimal AverageOverallPick { get; set; }
    }
}
