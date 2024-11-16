namespace CollegeFootballStats.Core.Queries
{
    public class InsertConference : SqlCommandBase
    {
        public InsertConference(int conferenceId, string? name, string? shortName, string? classification, string? abbreviation)
        {
            Parameters = new
            {
                ConferenceId = conferenceId,
                ShortName = name,
                Name = shortName,
                Division = classification,
                Abbreviation = abbreviation
            };
        }

        public override string Text => @"
            INSERT INTO Conference
            (
                ConferenceID,
                ShortName,
                Name,
                Division,
                Abbreviation
            )
            VALUES
            (
                :ConferenceId,
                :ShortName,
                :Name,
                :Division,
                :Abbreviation
            )
        ";
    }
}
