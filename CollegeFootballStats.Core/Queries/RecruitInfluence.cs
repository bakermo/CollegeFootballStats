using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Queries
{
    public class TeamRecruitingImpact : SqlCommandBase
    {
        public TeamRecruitingImpact(string conferenceId, string? teamId, string startYear, string endYear)
        {
            Parameters = new
            {
                ConferenceId = conferenceId,
                TeamId = teamId,
                StartYear = startYear,
                EndYear = endYear
            };
        }

        public override string Text => @"
            WITH TeamWinRates AS (
                SELECT
                    G.Season,
                    G.HomeTeam AS TeamID,
                    COUNT(*) AS TotalGames,
                    SUM(CASE WHEN G.HomePoints > G.AwayPoints THEN 1 ELSE 0 END) AS Wins
                FROM Game G
                WHERE G.Season BETWEEN :StartYear AND :EndYear
                GROUP BY G.Season, G.HomeTeam

                UNION ALL

                SELECT
                    G.Season,
                    G.AwayTeam AS TeamID,
                    COUNT(*) AS TotalGames,
                    SUM(CASE WHEN G.AwayPoints > G.HomePoints THEN 1 ELSE 0 END) AS Wins
                FROM Game G
                WHERE G.Season BETWEEN :StartYear AND :EndYear
                GROUP BY G.Season, G.AwayTeam
            ),
            TeamWinPercentages AS (
                SELECT
                    TeamID,
                    Season,
                    SUM(TotalGames) AS TotalGames,
                    SUM(Wins) AS Wins,
                    CAST(((SUM(Wins) * 1.0 / SUM(TotalGames)) * 100) AS DECIMAL) AS WinRate
                FROM TeamWinRates
                GROUP BY TeamID, Season
            ),
            TeamRecruitRatings AS (
                SELECT
                    R.TeamID,
                    R.Season,
                    CAST(AVG(RP.Rating) AS DECIMAL(5, 4)) AS AverageRecruitRating
                FROM RecruitingPlayers RP
                INNER JOIN Roster R ON RP.AthleteID = R.PlayerID
                WHERE R.Season BETWEEN :StartYear AND :EndYear
                GROUP BY R.TeamID, R.Season
            )
            SELECT
                TWP.TeamID,
                T.School,
                TWP.Season AS Year,
                TWP.WinRate,
                TRR.AverageRecruitRating
            FROM TeamWinPercentages TWP
            INNER JOIN TeamRecruitRatings TRR ON TWP.TeamID = TRR.TeamID AND TWP.Season = TRR.Season
            INNER JOIN ConferenceMembership CM ON TWP.TeamID = CM.TeamID AND TWP.Season = CM.Year
            INNER JOIN Team T ON TWP.TeamID = T.TeamID
            WHERE CM.ConferenceID = :ConferenceId
            AND (:TeamId IS NULL OR TWP.TeamID = :TeamId)
            ORDER BY TWP.Season, TWP.TeamID
        ";
    }
}

