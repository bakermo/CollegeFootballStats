using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Queries
{
    public class GetPlayersDefensive : SqlCommandBase
    {
        public GetPlayersDefensive(string teamID)
        {
            Parameters = new
            {
                TeamID = teamID
            };
        }

        public override string Text => @"SELECT DISTINCT P.PlayerID, P.FirstName, P.LastName, P.Position
FROM Player P
INNER JOIN
    Roster R ON R.PlayerID = P.PlayerID
WHERE
    TeamID = :TeamID
AND
    Position IN ('DL', 'LB', 'ILB', 'OLB', 'CB', 'DB', 'S', 'DE', 'DT', 'NT', 'EDGE','ATH')
ORDER BY P.FirstName ASC";
    }
}
