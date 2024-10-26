namespace CollegeFootballStats.Server
{
    public interface IQuery
    {
        string Text { get; }
        object? Parameters => null;
    }
}
