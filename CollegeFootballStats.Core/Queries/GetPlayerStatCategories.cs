using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Queries
{
    public class GetPlayerStatCategories : SqlCommandBase
    {
        public GetPlayerStatCategories(string playerID, string statType)
        {
            Parameters = new
            {
                PlayerID = playerID,
                StatType = statType
            };
        }

        public override string Text => @"SELECT DISTINCT SC.ID, SC.Category
FROM Player P
INNER JOIN
    Roster R ON R.PlayerID = P.PlayerID
INNER JOIN
    PlayerGameStat PGS ON PGS.Player = R.PlayerID
INNER JOIN
    StatType ST ON PGS.StatType = ST.ID
INNER JOIN
    StatCategory SC ON PGS.StatCategory = SC.ID
WHERE
    P.PlayerID = :PlayerID AND ST.Type = :StatType";
    }
}
