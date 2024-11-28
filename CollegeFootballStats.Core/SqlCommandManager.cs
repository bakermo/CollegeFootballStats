using Dapper;
using Oracle.ManagedDataAccess.Client;
using System.Data;

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

        public Task ExecuteAsync(ISqlCommand command)
        {
            using var conn = new OracleConnection(_connectionString);
            //await conn.ExecuteAsync(query.Text, query.Parameters);
            conn.Execute(command.Text, command.Parameters);

            return Task.CompletedTask;
        }

        /// <summary>
        /// Executes an insert command and returns the generated ID.
        /// Should be used when you need to get the ID of the inserted record.
        /// </summary>
        /// <typeparam name="T">The type of the ID, e.g., int or long.</typeparam>
        /// <param name="command">The SQL command containing the INSERT statement with a RETURNING clause.</param>
        /// <param name="idParameterName">The name of the output parameter for the ID.</param>
        /// <returns>The generated ID.</returns>
        public async Task<int> InsertAndGetIdAsync<T>(ISqlCommand command, string idParameterName = "ID")
        {
            using var conn = new OracleConnection(_connectionString);

            // Add the output parameter to the DynamicParameters
            var parameters = new DynamicParameters(command.Parameters);
            parameters.Add(idParameterName, dbType: DbType.Int32, direction: ParameterDirection.Output);

            // Execute the query
            await conn.ExecuteAsync(command.Text, parameters);

            // Retrieve the generated ID
            return parameters.Get<int>(idParameterName);
        }

        public Task TruncateTable(string tableName)
        {
            using var conn = new OracleConnection(_connectionString);
            conn.Execute($"TRUNCATE TABLE {tableName}");

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

        /// <summary>
        /// Returns the number of rows inserted by the bulk insert
        /// </summary>
        /// <param name="dataTable"></param>
        /// <returns></returns>
        public int BulkInsert(DataTable dataTable)
        {
            using var conn = new OracleConnection(_connectionString);
            {
                conn.Open();
                using (OracleBulkCopy bulkCopy = new OracleBulkCopy(conn))
                {
                    bulkCopy.DestinationSchemaName = "\"MATTHEW.BAKER\"";
                    bulkCopy.DestinationTableName = dataTable.TableName;
                    bulkCopy.BatchSize = 1000;
                    foreach (var column in dataTable.Columns)
                    {
                        bulkCopy.ColumnMappings.Add(column.ToString(), column.ToString());
                    }
                    try
                    {
                        bulkCopy.WriteToServer(dataTable);
                        Console.WriteLine("Bulk insert completed successfully.");
                        int rowsInserted = dataTable.Rows.Count;
                        dataTable.Clear(); // safety thing, in case the caller forgets, lol
                        return rowsInserted;
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error during bulk insert: {ex.Message} {ex.StackTrace} {ex.InnerException}");
                        throw;
                    }
                }
            }
        }
    }
}
