using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Queries
{
    public class GetStatTypes : SqlCommandBase
    {
        public override string Text => @"
            SELECT
                *   
            FROM    
                StatType st";
    }
}
