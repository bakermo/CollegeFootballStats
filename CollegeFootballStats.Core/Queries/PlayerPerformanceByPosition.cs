using System;

namespace CollegeFootballStats.Core.Queries
{
    public class PlayerPerformanceByPosition : SqlCommandBase
    {
        public PlayerPerformanceByPosition(string position, int startYear, int endYear)
        {
            Parameters = new
            {
                Position = position,
                StartYear = startYear,
                EndYear = endYear
            };
        }

        public override string Text => @"
            WITH PlayerStats AS (
                SELECT 
                    ps.Player AS PlayerID,
                    ps.Season,
                    ps.StatValue,
                    sc.Category,
                    st.Type,
                    ps.StatCategory
                FROM PlayerSeasonStat ps
                JOIN StatCategory sc ON ps.StatCategory = sc.ID
                JOIN StatType st ON ps.StatType = st.ID
                WHERE ps.StatValue IS NOT NULL
            ),
            NormalizedStats AS (
                SELECT 
                    ps.PlayerID,
                    ps.Season,
                    ps.Category,
                    ps.Type,
                    CASE 
                        WHEN (MAX(ps.StatValue) OVER (PARTITION BY ps.Category, ps.Type) - MIN(ps.StatValue) OVER (PARTITION BY ps.Category, ps.Type)) = 0 
                        THEN 0
                        ELSE (ps.StatValue - MIN(ps.StatValue) OVER (PARTITION BY ps.Category, ps.Type)) / 
                             (MAX(ps.StatValue) OVER (PARTITION BY ps.Category, ps.Type) - MIN(ps.StatValue) OVER (PARTITION BY ps.Category, ps.Type))
                    END AS NormalizedValue
                FROM PlayerStats ps
            ),
            PlayerScores AS (
                SELECT 
                    ns.PlayerID,
                    AVG(ns.NormalizedValue) AS PerformanceScore
                FROM NormalizedStats ns
                GROUP BY ns.PlayerID
            ),
            PercentileRanks AS (
                SELECT 
                    ps.PlayerID,
                    dp.OverallPick,
                    dp.Year AS DraftYear,
                    p.Position,
                    ps.PerformanceScore,
                    NTILE(4) OVER (PARTITION BY dp.Year ORDER BY ps.PerformanceScore DESC) AS Percentile
                FROM PlayerScores ps
                JOIN DraftPick dp
                    ON ps.PlayerID = dp.PlayerID
                JOIN Player p
                    ON ps.PlayerID = p.PlayerID
                WHERE dp.Year BETWEEN :StartYear AND :EndYear
                  AND p.Position = :Position
            ),
            AllPercentiles AS (
                SELECT DISTINCT dp.Year AS DraftYear, 1 AS Percentile FROM DraftPick dp WHERE dp.Year BETWEEN :StartYear AND :EndYear
                UNION ALL
                SELECT DISTINCT dp.Year AS DraftYear, 2 AS Percentile FROM DraftPick dp WHERE dp.Year BETWEEN :StartYear AND :EndYear
                UNION ALL
                SELECT DISTINCT dp.Year AS DraftYear, 3 AS Percentile FROM DraftPick dp WHERE dp.Year BETWEEN :StartYear AND :EndYear
                UNION ALL
                SELECT DISTINCT dp.Year AS DraftYear, 4 AS Percentile FROM DraftPick dp WHERE dp.Year BETWEEN :StartYear AND :EndYear
            )
            SELECT 
                ap.Percentile,
                ap.DraftYear,
                COALESCE(CAST(AVG(pr.OverallPick) AS DECIMAL(10, 2)), 0) AS AverageOverallPick
            FROM AllPercentiles ap
            LEFT JOIN PercentileRanks pr
                ON ap.DraftYear = pr.DraftYear AND ap.Percentile = pr.Percentile
            GROUP BY ap.Percentile, ap.DraftYear
            ORDER BY ap.DraftYear, ap.Percentile";
    }
}