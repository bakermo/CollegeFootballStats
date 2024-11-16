using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Queries
{
    public class InsertGame : SqlCommandBase
    {
        public InsertGame(int gameId, DateTime startDateTime, int season, int week, int homeTeamId, 
            int awayTeamId, int? homePoints, int? awayPoints, bool isCompleted, bool isPostseason)
        {
            Parameters = new
            {
                GameId = gameId,
                StartDateTime = startDateTime,
                Season = season,
                Week = week,
                HomeTeam = homeTeamId,
                AwayTeam = awayTeamId,
                HomePoints = homePoints,
                AwayPoints = awayPoints,
                IsCompleted = isCompleted,
                IsPostseason = isPostseason
            };
        }

        public override string Text => @"
            INSERT INTO Game
            (
                GameId,
                StartDateTime,
                Season,
                Week,
                HomeTeam,
                AwayTeam,
                HomePoints,
                AwayPoints,
                IsCompleted,
                IsPostseason
            )   
            VALUES
            (
                :GameId,
                :StartDateTime,
                :Season,
                :Week,
                :HomeTeam,
                :AwayTeam,
                :HomePoints,
                :AwayPoints,
                :IsCompleted,
                :IsPostseason
            )
        ";
    }
}
