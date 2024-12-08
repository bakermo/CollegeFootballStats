namespace CollegeFootballStats.Core.Queries
{
    public class GetTeamRecruitingAndDraft : SqlCommandBase
    {
        public GetTeamRecruitingAndDraft(int startYear, int endYear)
        {
            Parameters = new { StartYear = startYear, EndYear = endYear };
        }
        public override string Text => @"
            SELECT DISTINCT
                t.School AS TeamName,
                dp.Year AS DraftYear,
                dp.Round AS DraftRound,
                dp.RoundPick AS DraftRoundPick,
                dp.OverallPick AS DraftOverallPick,
                p.Position AS PlayerPosition,
                p.FirstName AS PlayerFirstName,
                p.LastName AS PlayerLastName,
                rs.Season AS PlayerSeason,
                ps.StatValue AS PlayerStatValue,
                pr.Poll AS TeamRankPoll,
                pr.Rank AS TeamRank,
                pr.Season AS TeamRankSeason
            FROM 
                DraftPick dp
            JOIN 
                Team t ON dp.CollegeTeam = t.TeamID
            JOIN 
                Player p ON dp.PlayerID = p.PlayerID
            JOIN 
                Roster rs ON rs.TeamID = t.TeamID AND rs.PlayerID = p.PlayerID
            LEFT JOIN 
                PlayerSeasonStat ps ON ps.Player = p.PlayerID AND ps.Season = rs.Season
            LEFT JOIN 
                Poll pr ON pr.TeamID = t.TeamID AND pr.Season = rs.Season
            WHERE 
                dp.Year BETWEEN :StartYear AND :EndYear
            ORDER BY 
                dp.Year, dp.Round, dp.RoundPick
        ";

    }
}