namespace CollegeFootballStats.Importer
{
    internal record ImporterConfig
    {
        public ImporterConfig(string connectionString, string apiUrl, string apiKey)
        {
            ConnectionString = connectionString;
            ApiUrl = apiUrl;
            ApiKey = apiKey;
        }

        public string ConnectionString { get; set; }
        public string ApiUrl { get; set; }
        public string ApiKey { get; set; }
    }
}
