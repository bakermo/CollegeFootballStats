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
                Classification = classification,
                Abbreviation = abbreviation
            };
        }

        public override string Text => @"
            INSERT INTO Conference
            (
                ConferenceID,
                ShortName,
                Name,
                Classification,
                Abbreviation
            )
            VALUES
            (
                :ConferenceId,
                :ShortName,
                :Name,
                :Classification,
                :Abbreviation
            )
        ";
    }
}
