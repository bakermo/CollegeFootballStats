using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Queries
{
    public class InsertPlayerGameStat : SqlCommandBase
    {
        public InsertPlayerGameStat(int gameId, int playerId, decimal statValue, string statCategory, string statType)
        {
            Parameters = new
            {
                StatId = 0,
                Game = gameId,
                Player = playerId,
                StatValue = statValue,
                StatCategory = statCategory,
                StatType = statType
            };
        }
        public override string Text => @"
            INSERT INTO PlayerGameStat(
                Game,
                Player,
                StatValue,
                StatCategory,
                StatType
            )
            VALUES(
                :Game,
                :Player,
                :StatValue,
                :StatCategory,
                :StatType
            )
            RETURNING StatID INTO :StatID
        ";
    }
}
