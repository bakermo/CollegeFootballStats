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
}
