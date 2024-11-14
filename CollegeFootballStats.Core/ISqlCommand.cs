namespace CollegeFootballStats.Core
{
    public interface ISqlCommand
    {
        string Text { get; }
        object? Parameters => null;
    }
}
