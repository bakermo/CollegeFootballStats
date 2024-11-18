using Dapper;
using System.Data;

namespace CollegeFootballStats.Core
{
    // Stupid Oracle doesn't have a boolean type, so we need to convert it to a number
    public class BoolToNumberHandler : SqlMapper.TypeHandler<bool>
    {
        public override void SetValue(IDbDataParameter parameter, bool value)
        {
            parameter.Value = value ? 1 : 0;
        }

        public override bool Parse(object value)
        {
            return Convert.ToInt32(value) == 1;
        }
    }

    public class DateTimeHandler : SqlMapper.TypeHandler<DateTime>
    {
        public override void SetValue(IDbDataParameter parameter, DateTime value)
        {
            parameter.Value = value;
            parameter.DbType = DbType.DateTime;
        }

        public override DateTime Parse(object value)
        {
            return Convert.ToDateTime(value);
        }
    }
}
