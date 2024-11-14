using CollegeFootballStats.Core;
using Microsoft.Extensions.Logging;

namespace CollegeFootballStats.Importer
{
    internal abstract class BaseImporter
    {
        protected readonly HttpClient _httpClient;
        protected readonly SqlCommandManager _sqlCommandManager;
        protected readonly ILogger _logger;

        public BaseImporter(ImporterConfig config, ILogger logger)
        {
            _logger = logger;
            _httpClient = new HttpClient();
            _httpClient.BaseAddress = new Uri(config.ApiUrl);
            _httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + config.ApiKey);
            _sqlCommandManager = new SqlCommandManager(config.ConnectionString);
        }

        public abstract Task ImportAsync();
    }
}
