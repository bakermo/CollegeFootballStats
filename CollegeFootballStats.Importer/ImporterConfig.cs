namespace CollegeFootballStats.Importer
{
    internal record ImporterConfig
    {
        public ImporterConfig(string connectionString, string apiV1Url, string apiKey, string apiV2Url = null)
        {
            ConnectionString = connectionString;
            ApiV1URL = apiV1Url;
            ApiV2URL = apiV2Url;
            ApiKey = apiKey;
        }

        public string ConnectionString { get; set; }
        public string ApiV1URL { get; set; }
        public string? ApiV2URL { get; set; }
        public string ApiKey { get; set; }
    }
}
