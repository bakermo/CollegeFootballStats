using CollegeFootballStats.Core;
using CollegeFootballStats.Importer;
using Dapper;
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

SqlMapper.RemoveTypeMap(typeof(bool));
SqlMapper.AddTypeHandler(typeof(bool), new BoolToNumberHandler());

// Get the logger from the service provider

// Instantiate the importer and pass the logger
var importerLogger = serviceProvider.GetRequiredService<Microsoft.Extensions.Logging.ILogger<Program>>();

var importerConfig = new ImporterConfig(connectionString, apiUrl, apiKey);

int actionChoice = GetAction();

while (actionChoice != (int)ImporterAction.Exit)
{
    BaseImporter importer = null;
    switch ((ImporterAction)actionChoice)
    {
        case ImporterAction.RunImport:
            int importChoice = GetImportAction();
            switch ((ImportType)importChoice)
            {
                case ImportType.Coaches:
                    importer = new CoachesImporter(importerConfig, importerLogger);
                    break;
                case ImportType.Conferences:
                    importer = new ConferencesImporter(importerConfig, importerLogger);
                    break;
                case ImportType.DraftPicks:
                    //importer = new DraftPicksImporter(importerConfig, importerLogger);
                    break;
                case ImportType.Games:
                    importer = new GamesImporter(importerConfig, importerLogger);
                    break;
                case ImportType.Players:
                    importer = new PlayersImporter(importerConfig, importerLogger);
                    break;
                case ImportType.PlayerGameStats:
                    //importer = new PlayerGameStatsImporter(importerConfig, importerLogger);
                    break;
                case ImportType.Polls:
                    importer = new PollsImporter(importerConfig, importerLogger);
                    break;
                case ImportType.Rosters:
                    //importer = new RostersImporter(importerConfig, importerLogger);
                    break;
                case ImportType.Teams:
                    importer = new TeamsImporter(importerConfig, importerLogger);
                    break;
                case ImportType.TeamGameStats:
                    //importer = new TeamGameStatsImporter(importerConfig, importerLogger);
                    break;
                default:
                    Console.WriteLine("Invalid import type.");
                    break;
            }
            if (importer != null)
            {
                Console.WriteLine("\nImporting data, please wait...");
                await importer.ImportAsync();
                Console.WriteLine("Import complete. DON'T FORGET TO COMMIT YOUR CHANGES!");
            }
            break;
        case ImporterAction.CommitChanges:
            Console.WriteLine("Committing changes, please wait...");
            importer = new Committer(importerConfig, importerLogger);
            await importer.ImportAsync();
            Console.WriteLine("Changes committed.");
            break;
        default:
            break;
    }

    actionChoice = GetAction();
}


int GetImportAction()
{
    bool validImportAction = false;
    int importActionChoice = 0;
    while (!validImportAction)
    {
        Console.WriteLine("\nChoose an import type (Enter the number): ");
        Enum.GetValues<ImportType>().ToList().ForEach(importType =>
        {
            Console.WriteLine($"{(int)importType}: {importType}");
        });

        validImportAction = int.TryParse(Console.ReadLine(), out importActionChoice);
        // if the action is not in the enum, set validAction to false   
        if (!Enum.IsDefined(typeof(ImportType), importActionChoice))
        {
            validImportAction = false;
            Console.WriteLine("Invalid import type.");
        }
    }
    return importActionChoice;
}

int GetAction()
{
    bool validAction = false;
    int actionChoice = 0;
    while (!validAction)
    {
        Console.WriteLine("\nChoose an action (Enter the number):");
        Enum.GetValues<ImporterAction>().ToList().ForEach(action =>
        {
            Console.WriteLine($"{(int)action}: {action}");
        });

        validAction = int.TryParse(Console.ReadLine(), out actionChoice);
        // if the action is not in the enum, set validAction to false   
        if (!Enum.IsDefined(typeof(ImporterAction), actionChoice))
        {
            validAction = false;
            Console.WriteLine("Invalid action.");
        }
    }
    return actionChoice;
}

public enum ImporterAction
{
    Exit = 0,
    RunImport = 1,
    CommitChanges = 2
}

public enum ImportType
{
    Coaches,
    Conferences,
    DraftPicks,
    Games,
    Players,
    PlayerGameStats,
    Polls,
    Rosters,
    Teams,
    TeamGameStats,
}