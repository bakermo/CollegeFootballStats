using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Queries
{
    public class InsertCoachingRecord : SqlCommandBase
    {
        public InsertCoachingRecord(int coachId, int teamId, int year, int games, int wins, int losses, int ties)
        {
            Parameters = new
            {
                CoachID = coachId,
                TeamID = teamId,
                Games = games,
                Year = year,
                Wins = wins,
                Losses = losses,
                Ties = ties
            };
        }
        public override string Text => @"
            INSERT INTO CoachingRecord
            (
                CoachID,
                TeamID,
                Year,
                Games,
                Wins,
                Losses,
                Ties
            )
            VALUES
            (
                :CoachID,
                :TeamID,
                :Year,
                :Games, 
                :Wins,
                :Losses,
                :Ties
            )
        ";
    }
}
