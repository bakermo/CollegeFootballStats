
namespace CollegeFootballStats.Core.Queries
{
    public class InsertPlayerAndRoster : SqlCommandBase
    {
        public InsertPlayerAndRoster(int playerId, string firstName, string lastName, string position, 
            int? weight, int? year, int? jerseyNo, int? height, int teamId, int season)
        {
            Parameters = new
            {
                PlayerId = playerId,
                FirstName = firstName,
                LastName = lastName,
                Position = position,
                Weight = weight,
                Year = year,
                JerseyNo = jerseyNo,
                Height = height,
                TeamId = teamId,
                Season = season
            };
        }

        // insert the player into the player table if that ID doesn't already exist
        public override string Text => @"
            BEGIN
                DECLARE
                    v_count NUMBER;
                BEGIN
                    SELECT COUNT(*) INTO v_count FROM Player WHERE PlayerId = :PlayerId;
                    IF v_count = 0 THEN
                        INSERT INTO Player (PlayerId, FirstName, LastName, Position, Weight, Year, JerseyNo, Height)
                        VALUES (:PlayerId, :FirstName, :LastName, :Position, :Weight, :Year, :JerseyNo, :Height);
                    END IF;

                    INSERT INTO Roster (TeamId, PlayerId, Season)
                    VALUES (:TeamId, :PlayerId, :Season);
                END;
            END;
        ";
    }
}
