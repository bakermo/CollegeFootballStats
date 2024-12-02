using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Queries
{
    public class CoachingImpact : SqlCommandBase
    {
        public CoachingImpact(string teamID, string coachID, string startYear, string endYear)
        {
            Parameters = new
            {
                TeamID = teamID,
                CoachID = coachID,
                StartYear = startYear,
                EndYear = endYear
            };
        }

        public override string Text => @"
            WITH LastWeekRank AS (
    SELECT 
        P.TeamID,
        P.Season,
        MAX(CASE WHEN P.IsPostSeason = 1 THEN P.Week ELSE NULL END) AS PostSeasonWeek,
        MAX(CASE WHEN P.IsPostSeason = 1 AND P.Poll = 'AP Top 25' THEN P.Rank ELSE NULL END) AS PostSeasonAPRank,
        MAX(CASE WHEN P.IsPostSeason = 1 AND P.Poll = 'Coaches Poll' THEN P.Rank ELSE NULL END) AS PostSeasonCoachesRank,
        MAX(CASE WHEN P.IsPostSeason = 1 AND P.Poll = 'Playoff Committee Rankings' THEN P.Rank ELSE NULL END) AS PostSeasonPlayerCommitterRank,
        MAX(P.Week) AS LastWeek,
        MAX(CASE WHEN P.IsPostSeason = 0 AND P.Poll = 'AP Top 25' AND P.Week = (SELECT MAX(P1.Week) FROM Poll P1 WHERE P1.TeamID = P.TeamID AND P1.Season = P.Season) THEN P.Rank ELSE NULL END) AS LastWeekAPRank,
        MAX(CASE WHEN P.IsPostSeason = 0 AND P.Poll = 'Coaches Poll' AND P.Week = (SELECT MAX(P1.Week) FROM Poll P1 WHERE P1.TeamID = P.TeamID AND P1.Season = P.Season) THEN P.Rank ELSE NULL END) AS LastWeekCoachesRank,
        MAX(CASE WHEN P.IsPostSeason = 0 AND P.Poll = 'Playoff Committee Rankings' AND P.Week = (SELECT MAX(P1.Week) FROM Poll P1 WHERE P1.TeamID = P.TeamID AND P1.Season = P.Season) THEN P.Rank ELSE NULL END) AS LastWeekPlayerCommitterRank
    FROM 
        Poll P
    GROUP BY 
        P.TeamID, P.Season
),
WinPercentage2024 AS (
    SELECT
        G.Season,
        G.HomeTeam AS TeamID,
        COUNT(*) AS TotalGames,
        SUM(CASE WHEN G.HomePoints > G.AwayPoints THEN 1 ELSE 0 END) AS Wins
    FROM Game G
    WHERE G.Season = 2024 AND G.HomeTeam = 213
    GROUP BY G.Season, G.HomeTeam

    UNION ALL

    SELECT
        G.Season,
        G.AwayTeam AS TeamID,
        COUNT(*) AS TotalGames,
        SUM(CASE WHEN G.AwayPoints > G.HomePoints THEN 1 ELSE 0 END) AS Wins
    FROM Game G
    WHERE G.Season = 2024 AND G.AwayTeam = 213
    GROUP BY G.Season, G.AwayTeam
),
TeamWinPercentage2024 AS (
    SELECT
        TeamID,
        Season,
        SUM(TotalGames) AS TotalGames,
        SUM(Wins) AS Wins,
        CAST(((SUM(Wins) * 1.0 / SUM(TotalGames)) * 100) AS DECIMAL) AS WinPercentage
    FROM WinPercentage2024
    GROUP BY TeamID, Season
)
SELECT 
    CR.CoachID,
    C.FirstName,
    C.LastName,
    T.School,
    CR.Year,
    CASE
        WHEN CR.Year = 2024 THEN COALESCE(TWP2024.WinPercentage, 0)
        WHEN CR.Games > 0 THEN CAST(((CR.Wins / CR.Games) * 100) AS DECIMAL)
        ELSE 0
    END AS WinPercentage,
    CASE 
        WHEN LWR.PostSeasonAPRank IS NOT NULL THEN LWR.PostSeasonAPRank
        ELSE LWR.LastWeekAPRank
    END AS APRank,
    CASE 
        WHEN LWR.PostSeasonCoachesRank IS NOT NULL THEN LWR.PostSeasonCoachesRank
        ELSE LWR.LastWeekCoachesRank
    END AS CoachesPollRank,
    CASE 
        WHEN LWR.PostSeasonPlayerCommitterRank IS NOT NULL THEN LWR.PostSeasonPlayerCommitterRank
        ELSE LWR.LastWeekPlayerCommitterRank
    END AS PlayerCommitterRank
FROM 
    CoachingRecord CR
INNER JOIN
    Coach C ON CR.CoachID = C.CoachID
INNER JOIN
    Team T ON CR.TeamID = T.TeamID
LEFT JOIN
    LastWeekRank LWR ON LWR.TeamID = T.TeamID AND LWR.Season = CR.Year
LEFT JOIN
    TeamWinPercentage2024 TWP2024 ON TWP2024.TeamID = CR.TeamID AND TWP2024.Season = CR.Year
WHERE 
    CR.TeamID = :TeamID AND CR.CoachID = :CoachID AND CR.Year BETWEEN :StartYear AND :EndYear
ORDER BY 
    CR.Year";
    }
}
