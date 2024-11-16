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

    internal class CoachResponse
    {
        // Gotta have the dumb underscores because that
        // is what the api returns
        public string First_Name { get; set; }
        public string Last_Name { get; set; }
        public List<CoachSeason> Seasons { get; set; }
        public CoachResponse()
        {
            Seasons = new List<CoachSeason>();
        }

    }

    internal class CoachSeason
    {
        // The give us the school name in the api, but we need the id
        // so we will have to look it up
        public string School { get; set; }
        public int Year { get; set; }
        public int Games { get; set; }
        public int Wins { get; set; }
        public int Losses { get; set; }
        public int Ties { get; set; }
    }

    internal class GameResponse
    {
        public int Id { get; set; }
        public int Season { get; set; }
        public int Week { get; set; }
        public DateTime Start_Date { get; set; }
        public int Home_Id { get; set; }
        public string Home_Team { get; set; }
        public int? Home_Points { get; set; }
        public int Away_Id { get; set; }
        public string Away_Team { get; set; }
        public int? Away_Points { get; set; }
        public bool Completed { get; set; }
        public string Season_Type { get; set; }
    }
}

internal class ConferenceResponse
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public string? Short_Name { get; set; }
    public string? Classification { get; set; }
    public string? Abbreviation { get; set; }
}
