using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Queries
{
    public class GetCoachesByTeam : SqlCommandBase
    {
        public GetCoachesByTeam(int teamID)
        {
            Parameters = new
            {
                TeamID = teamID
            };
        }

        public override string Text => @"
            SELECT DISTINCT
                C.CoachID,
                C.FirstName,
                C.LastName
            FROM    
                Coach C
            INNER JOIN
                CoachingRecord CR ON C.CoachID = CR.CoachID
            WHERE
                CR.TeamID = :TeamID 
            AND 
                CR.Year BETWEEN 2004 AND 2024";
    }
}
