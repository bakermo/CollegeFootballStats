using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Models
{
    public class Player
    {
        public int PlayerID { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Position { get; set; }
        public int? Weight { get; set; }
        public int? Height { get; set; }
        public int? Jersey { get; set; }    
        // Year is the school year (1-4), not season
        public int? Year { get; set; }
    }
}
