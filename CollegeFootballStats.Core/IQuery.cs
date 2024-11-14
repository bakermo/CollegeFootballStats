namespace CollegeFootballStats.Core
{
    public interface IQuery
    {
        string Text { get; }
        object? Parameters => null;
    }
}
