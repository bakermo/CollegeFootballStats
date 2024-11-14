namespace CollegeFootballStats.Core
{
    public abstract class SqlCommandBase : ISqlCommand
    {
        public abstract string Text { get; }

        public virtual object Parameters { get; protected set; } = null;
    }
}
