using Microsoft.Extensions.Logging;

namespace CollegeFootballStats.Importer
{
    // kind of an anti-pattern because I am not importing, but whatever
    internal class Committer : BaseImporter
    {
        public Committer(ImporterConfig config, ILogger logger) : base(config, logger)
        {
        }

        public override Task ImportAsync()
        {
            return _sqlCommandManager.CommitChanges();
        }
    }
}
