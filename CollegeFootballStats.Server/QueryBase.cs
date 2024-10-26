﻿namespace CollegeFootballStats.Server
{
    public abstract class QueryBase : IQuery
    {
        public abstract string Text { get; }

        public virtual object Parameters { get; protected set; } = null;
    }
}
