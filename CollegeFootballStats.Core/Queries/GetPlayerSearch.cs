using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace CollegeFootballStats.Core.Queries
{
    public class GetPlayerSearch : SqlCommandBase
    {
        public GetPlayerSearch(string search)
        {
            Parameters = new
            {
                Search = $"{search}%"
            };
        }

        public override string Text => @"
                SELECT
    *
    FROM    
    Player
  WHERE
    FirstName || ' ' || LastName LIKE :Search
FETCH FIRST 10 ROWS ONLY
            ";
    }
}
