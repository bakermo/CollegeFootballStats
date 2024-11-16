using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Queries
{
    public class InsertPoll : SqlCommandBase
    {
        public InsertPoll(string poll, int teamId, int season, int week, int rank, bool isPostseason)
        {
            Parameters = new
            {
                PollId = 0,
                Poll = poll,
                TeamId = teamId,
                Season = season,
                Week = week,
                Rank = rank,
                IsPostseason = isPostseason
            };
        }

        public override string Text => @"
            INSERT INTO Poll
            (
                Poll,
                TeamID,
                Rank,
                Season,
                Week,
                IsPostseason
            )
            VALUES
            (
                :Poll,
                :TeamId,
                :Rank,
                :Season,
                :Week,
                :IsPostseason
            )
            RETURNING PollID INTO :PollID
        ";
    }
}
