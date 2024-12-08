using CollegeFootballStats.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Queries
{
    public class PlayerImpact : SqlCommandBase
    {
        public PlayerImpact(string teamID, string playerID, string startYear, string endYear, string statType, string statCategory,
            string compOperator, int compValue)
        {
            // Validate the comparison operator
            if (!new[] { "=", "<", ">", "<=", ">=", "<>" }.Contains(compOperator))
            {
                throw new ArgumentException("Invalid comparison operator", nameof(compOperator));
            }

            Parameters = new
            {
                TeamID = teamID,
                PlayerID = playerID,
                StartYear = startYear,
                EndYear = endYear,
                StatType = statType,
                StatCategory = statCategory,
                CompValue = compValue // for stat value to compare
            };

            // Store the validated comparison operator
            CompOperator = compOperator;
        }

        private string CompOperator { get; }

        public override string Text => $@"
                WITH TeamGames AS (
        SELECT 
            G.GameID,
            G.Season,
            G.HomeTeam AS TeamID,
            G.HomePoints,
            G.AwayPoints,
            CASE WHEN G.HomePoints > G.AwayPoints THEN G.HomeTeam ELSE G.AwayTeam END AS WinningTeam
        FROM GAME G
        WHERE G.Season BETWEEN 2004 AND 2024
        
        UNION ALL
        
        SELECT 
            G.GameID,
            G.Season,
            G.AwayTeam AS TeamID,
            G.HomePoints,
            G.AwayPoints,
            CASE WHEN G.AwayPoints > G.HomePoints THEN G.AwayTeam ELSE G.HomeTeam END AS WinningTeam
        FROM GAME G
        WHERE G.Season BETWEEN 2004 AND 2024
    ),
    PlayerPerformance AS (
        SELECT 
            PGS.Player,
            PGS.Game,
            G.Season,
            SUM(CASE WHEN ST.Type = 'TD' AND SC.Category = 'passing' THEN PGS.StatValue ELSE 0 END) AS PassingTDs
        FROM PLAYERGAMESTAT PGS
        INNER JOIN STATTYPE ST ON PGS.StatType = ST.ID
        INNER JOIN STATCATEGORY SC ON PGS.StatCategory = SC.ID
        INNER JOIN GAME G ON PGS.Game = G.GameID
        WHERE G.Season BETWEEN 2004 AND 2024
        GROUP BY PGS.Player, PGS.Game, G.Season
        HAVING SUM(CASE WHEN ST.Type = 'TD' AND SC.Category = 'passing' THEN PGS.StatValue ELSE 0 END) < 2
    ),
    GamesWithPlayerTDs AS (
        SELECT 
            PP.Player,
            PP.Game,
            PP.Season,
            TG.TeamID,
            TG.WinningTeam,
            G.Week
        FROM PlayerPerformance PP
        INNER JOIN TeamGames TG ON PP.Game = TG.GameID AND TG.TeamID IN (
            SELECT R.TeamID FROM ROSTER R WHERE R.PlayerID = PP.Player
        )
        INNER JOIN GAME G ON PP.Game = G.GameID
    ),
    WinPercentage AS (
        SELECT 
            GWP.Player,
            GWP.Season,
            COUNT(*) AS TotalGames,
            SUM(CASE WHEN GWP.TeamID = GWP.WinningTeam THEN 1 ELSE 0 END) AS Wins,
            CAST(((SUM(CASE WHEN GWP.TeamID = GWP.WinningTeam THEN 1 ELSE 0 END) * 1.0 / COUNT(*)) * 100) AS DECIMAL) AS WinPercentage
        FROM GamesWithPlayerTDs GWP
        GROUP BY GWP.Player, GWP.Season
    )
    SELECT DISTINCT
        P.PlayerID,
        G.GameID,
        P.FirstName, 
        P.LastName,
        P.Position,
        ST.Type, 
        SC.Category, 
        PGS.StatValue, 
        G.Season,
        WP.WinPercentage,
        G.Week,
        G.IsPostSeason,
        PAP.Rank AS APTop25Rank,
        PCP.Rank AS CoachesPollRank,
        PCR.Rank AS PlayoffCommitteeRank
    FROM PLAYER P
    INNER JOIN PLAYERGAMESTAT PGS ON P.PlayerID = PGS.Player
    INNER JOIN STATTYPE ST ON PGS.StatType = ST.ID
    INNER JOIN STATCATEGORY SC ON PGS.StatCategory = SC.ID
    INNER JOIN GAME G ON PGS.Game = G.GameID
    INNER JOIN ROSTER R ON P.PlayerID = R.PlayerID AND G.Season = R.Season
    INNER JOIN TEAM T ON R.TeamID = T.TeamID
    INNER JOIN WinPercentage WP ON P.PlayerID = WP.Player AND G.Season = WP.Season
    LEFT JOIN POLL PAP ON G.Season = PAP.Season AND G.Week = PAP.Week AND PAP.TeamID = T.TeamID AND G.IsPostSeason = PAP.IsPostSeason AND PAP.Poll = 'AP Top 25'
    LEFT JOIN POLL PCP ON G.Season = PCP.Season AND G.Week = PCP.Week AND PCP.TeamID = T.TeamID  AND G.IsPostSeason = PCP.IsPostSeason AND PCP.Poll = 'Coaches Poll'
    LEFT JOIN POLL PCR ON G.Season = PCR.Season AND G.Week = PCR.Week AND PCR.TeamID = T.TeamID  AND G.IsPostSeason = PCR.IsPostSeason AND PCR.Poll = 'Playoff Committee Rankings'
    WHERE P.PlayerID = :PlayerID AND T.TeamID = :TeamID AND ST.Type = :StatType AND SC.Category = :StatCategory AND PGS.StatValue {CompOperator} :CompValue
    AND G.Season BETWEEN :StartYear AND :EndYear
    ORDER BY G.Season ASC, G.IsPostSeason ASC, G.Week ASC";
    }
}
