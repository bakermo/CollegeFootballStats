using CollegeFootballStats.Importer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Serilog;

// Set up configuration sources.
var builder = new ConfigurationBuilder()
    .SetBasePath(Directory.GetCurrentDirectory())
    .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
    .AddUserSecrets<Program>();

IConfiguration configuration = builder.Build();

var connectionString = configuration.GetConnectionString("UFOracle");
var apiUrl = configuration["CollegeFootballDataApi:Url"];
var apiKey = configuration["CollegeFootballDataApi:ApiKey"];


Console.WriteLine($"Connection String: {connectionString}");
Console.WriteLine($"API Url: {apiUrl}");
Console.WriteLine($"API Key: {apiKey}");

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .MinimumLevel.Verbose()
    .WriteTo.Console()
    .WriteTo.File("logs/log.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

// Set up dependency injection
var serviceProvider = new ServiceCollection()
    .AddLogging(loggingBuilder =>
    {
        loggingBuilder.AddSerilog(dispose: true);
    })
    .AddSingleton(configuration)
    .BuildServiceProvider();

// Get the logger from the service provider

// Instantiate the importer and pass the logger
var importerLogger = serviceProvider.GetRequiredService<Microsoft.Extensions.Logging.ILogger<Program>>();

var importerConfig = new ImporterConfig(connectionString, apiUrl, apiKey);
BaseImporter importer = null;

// TODO: thinking we can have some args passed in or a switch statement based on input to pick a thing to import
importer = new TeamsImporter(importerConfig, importerLogger);

await importer.ImportAsync();

// TODO: Add a config/arg to do commit or rollback automatically
Console.WriteLine("Import complete. DON'T FORGET TO COMMIT YOUR CHANGES MANUALLY!");
Console.WriteLine("Press any key to exit...");
Console.ReadLine();