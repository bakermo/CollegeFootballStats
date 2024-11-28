using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Queries
{
    public class InsertStatCategory : SqlCommandBase
    {
        public InsertStatCategory(string category)
        {
            Parameters = new
            {
                ID = 0,
                Category = category
            };
        }

        public override string Text => @"
            INSERT INTO StatCategory
            (
                Category
            )
            VALUES
            (
                :Category
            )
            RETURNING ID INTO :ID
        ";
    }
}
