// Add this to CollegeFootballStats.Core/Queries/GetConferenceEvolution.cs
using System;

namespace CollegeFootballStats.Core.Queries
{
    public class GetConferenceEvolution : SqlCommandBase
    {
        public GetConferenceEvolution(int conferenceId, int? teamId, int startYear, int endYear)
        {
            Parameters = new
            {
                ConferenceID = conferenceId,
                TeamID = teamId,
                StartYear = startYear,
                EndYear = endYear
            };
        }

        public override string Text => @"
            WITH GameStats AS (
                SELECT 
                    t.TeamID,
                    t.School,
                    g.Season,
                    CASE 
                        WHEN g.HomeTeam = t.TeamID THEN g.HomePoints 
                        ELSE g.AwayPoints 
                    END as PointsScored,
                    CASE 
                        WHEN g.HomeTeam = t.TeamID THEN g.AwayPoints
                        ELSE g.HomePoints
                    END as PointsAllowed
                FROM Team t
                JOIN Game g ON t.TeamID = g.HomeTeam OR t.TeamID = g.AwayTeam
                WHERE g.IsCompleted = 1
            ),
            SeasonAverages AS (
                SELECT 
                    gs.TeamID,
                    gs.School,
                    gs.Season,
                    ROUND(AVG(gs.PointsScored), 2) as AvgPointsScored,
                    ROUND(AVG(gs.PointsAllowed), 2) as AvgPointsAllowed,
                    ROUND(AVG(gs.PointsScored - gs.PointsAllowed), 2) as PointDifferential,
                    COUNT(*) as GamesPlayed
                FROM GameStats gs
                GROUP BY gs.TeamID, gs.School, gs.Season
            )
            SELECT 
                sa.Season,
                CASE 
                    WHEN :TeamID IS NULL THEN ROUND(AVG(sa.AvgPointsScored), 2)
                    ELSE MAX(CASE WHEN sa.TeamID = :TeamID THEN sa.AvgPointsScored END)
                END as AvgPointsScored,
                CASE 
                    WHEN :TeamID IS NULL THEN ROUND(AVG(sa.AvgPointsAllowed), 2)
                    ELSE MAX(CASE WHEN sa.TeamID = :TeamID THEN sa.AvgPointsAllowed END)
                END as AvgPointsAllowed,
                CASE 
                    WHEN :TeamID IS NULL THEN ROUND(AVG(sa.PointDifferential), 2)
                    ELSE MAX(CASE WHEN sa.TeamID = :TeamID THEN sa.PointDifferential END)
                END as PointDifferential
            FROM SeasonAverages sa
            JOIN ConferenceMembership cm ON sa.TeamID = cm.TeamID AND sa.Season = cm.Year
            WHERE cm.ConferenceID = :ConferenceID
            AND sa.Season BETWEEN :StartYear AND :EndYear
            GROUP BY sa.Season
            ORDER BY sa.Season";
    }
}