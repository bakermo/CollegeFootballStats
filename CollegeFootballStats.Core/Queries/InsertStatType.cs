using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Queries
{
    public class InsertStatType : SqlCommandBase
    {
        public InsertStatType(string type)
        {
            Parameters = new
            {
                ID = 0,
                Type = type
            };
        }
        public override string Text => @"
            INSERT INTO StatType
            (
                Type
            )
            VALUES
            (
                :Type
            )
            
            RETURNING ID INTO :ID
        ";
    }
}
