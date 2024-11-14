using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Importer
{
    internal class TeamResponse
    {
        public int Id { get; set; }
        public string School { get; set; }

        // yes...abbreviation is nullable in the api...guessing we wont use those teams much
        public string? Abbreviation { get; set; }
    }
}
