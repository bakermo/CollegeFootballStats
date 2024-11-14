using Dapper;
using Oracle.ManagedDataAccess.Client;

namespace CollegeFootballStats.Core
{
    public class SqlCommandManager
    {
        private readonly string _connectionString;

        public SqlCommandManager(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(ISqlCommand query)
        {
            using var conn = new OracleConnection(_connectionString);
            return await conn.QueryAsync<T>(query.Text, query.Parameters);
        }

        public async Task<T> QueryFirstOrDefault<T>(ISqlCommand query)
        {
            using var conn = new OracleConnection(_connectionString);
            return await conn.QueryFirstOrDefaultAsync<T>(query.Text, query.Parameters);
        }   

        public Task ExecuteAsync(ISqlCommand query)
        {
            using var conn = new OracleConnection(_connectionString);
            //await conn.ExecuteAsync(query.Text, query.Parameters);
            conn.Execute(query.Text, query.Parameters);

            return Task.CompletedTask;
        }

        public Task RollBackChanges()
        {
            using var conn = new OracleConnection(_connectionString);
            conn.Execute("ROLLBACK");
            return Task.CompletedTask;
        }

        public Task CommitChanges()
        {
            using var conn = new OracleConnection(_connectionString);
            conn.Execute("COMMIT");

            return Task.CompletedTask;
        }
    }
}
