using Dapper;
using Oracle.ManagedDataAccess.Client;

namespace CollegeFootballStats.Core
{
    public class QueryManager
    {
        private readonly string _connectionString;

        public QueryManager(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<T>> QueryAsync<T>(IQuery query)
        {
            using var conn = new OracleConnection(_connectionString);
            return await conn.QueryAsync<T>(query.Text, query.Parameters);
        }

        public async Task<T> QueryFirstOrDefault<T>(IQuery query)
        {
            using var conn = new OracleConnection(_connectionString);
            return await conn.QueryFirstOrDefaultAsync<T>(query.Text, query.Parameters);
        }   
    }
}
