namespace CollegeFootballStats.Core.Queries
{
    public class CountTuplesByTable : SqlCommandBase
    {
        private readonly string _tableName;
        public CountTuplesByTable(string tableName)
        {
            _tableName = tableName;
        }

        public override string Text => $"SELECT COUNT(*) FROM {_tableName}";
    }
}
