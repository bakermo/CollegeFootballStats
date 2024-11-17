using CollegeFootballStats.Importer;
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
        public string School { get; set; } = string.Empty;

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
        public string School { get; set; } = string.Empty;
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
        public string Home_Team { get; set; } = string.Empty;
        public int? Home_Points { get; set; }
        public int Away_Id { get; set; }
        public string Away_Team { get; set; } = string.Empty;
        public int? Away_Points { get; set; }
        public bool Completed { get; set; }
        public string Season_Type { get; set; } = string.Empty;
    }

    internal class ConferenceResponse
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? Short_Name { get; set; }
        public string? Classification { get; set; }
        public string? Abbreviation { get; set; }
    }

    internal class RosterResponse
    {
        public int Id { get; set; }
        public string First_Name { get; set; } = string.Empty;
        public string Last_Name { get; set; } = string.Empty;
        public string Team { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public int? Jersey { get; set; }
        public int? Height { get; set; }
        public int? Weight { get; set; }
        public int? Year { get; set; }
    }
    internal class PollResponse
    {
        public int Season { get; set; }
        public string SeasonType { get; set; }
        public int Week { get; set; }
        public List<ActualPolls> Polls { get; set; }
        public PollResponse()
        {
            Polls = new List<ActualPolls>();
        }
    }

    internal class ActualPolls
    {
        public string Poll { get; set; }
        public List<PollRankings> Ranks { get; set; }
        public ActualPolls()
        {
            Ranks = new List<PollRankings>();
        }
    }

    internal class PollRankings
    {
        public int Rank { get; set; }
        public string School { get; set; } = string.Empty;
    }

    internal class DraftPickResponse
    {
        // Yes.. in the api this can be null...so we will skip it
        public int? CollegeAthleteId { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Year { get; set; }
        public int Round { get; set; }
        public int CollegeId { get; set; }
        public string CollegeTeam { get; set; } = string.Empty;
        public string NFLTeam { get; set; } = string.Empty;
        public string Position { get; set; } = string.Empty;
        public int Pick { get; set; }
        public int Overall { get; set; }
    }

    internal class TeamGameStatResponse
    {
        /// <summary>
        /// The game Id
        /// </summary>
        public int Id { get; set; }
        public List<TeamGameStatTeam> Teams { get; set; }
        public TeamGameStatResponse()
        {
            Teams = new List<TeamGameStatTeam>();
        }
    }

    internal class TeamGameStatTeam
    {
        /// <summary>
        /// The team Id
        /// </summary>
        public int SchoolId { get; set; }
        public string School { get; set; }
        public List<TeamGameStat> Stats { get; set; }
        public TeamGameStatTeam()
        {
            Stats = new List<TeamGameStat>();
        }
    }

    internal class TeamGameStat
    {
        public string Category { get; set; } = string.Empty;
        public string Stat { get; set; } = string.Empty;
    }

    internal class PlayerGameStatResponse
    {
        /// <summary>
        /// The game ID
        /// </summary>
        public int Id { get; set; }
        public List<PlayerGameStatTeam> Teams { get; set; }
        public PlayerGameStatResponse()
        {
            Teams = new List<PlayerGameStatTeam>();
        }
    }

    internal class PlayerGameStatTeam
    {
        // it gives us the school too but we don't really care
        public List<PlayerGameStatCategory> Categories { get; set; }
        public PlayerGameStatTeam()
        {
            Categories = new List<PlayerGameStatCategory>();
        }
    }

    internal class PlayerGameStatCategory
    {
        public string Name { get; set; } = string.Empty;
        public List<PlayerGameStatType> Types { get; set; }
        public PlayerGameStatCategory()
        {
            Types = new List<PlayerGameStatType>();
        }
    }

    internal class PlayerGameStatType
    {
        public string Name { get; set; } = string.Empty;
        public List<PlayerGameStatAthlete> Athletes { get; set; }
        public PlayerGameStatType()
        {
            Athletes = new List<PlayerGameStatAthlete>();
        }
    }

    internal class PlayerGameStatAthlete
    {
        // PlayerId
        public int? Id { get; set; }
        public string Name { get; set; } = string.Empty;   
        public string Stat { get; set; } = string.Empty;
    }
}
