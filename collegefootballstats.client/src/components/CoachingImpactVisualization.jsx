import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const CoachingImpactVisualization = ({ data }) => {
    if (!data || data.length === 0) {
        return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            No data available
        </div>;
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}>
                    <p style={{ margin: 0 }}>Year: {label}</p>
                    {payload.map((entry) => (
                        <p key={entry.name} style={{
                            color: entry.color,
                            margin: '5px 0 0 0'
                        }}>
                            {entry.name}: {Number(entry.value).toFixed(2)}<br />
                            {entry.name === 'Win Percentage' ? 'Win %' : 'Rank'}: {Number(entry.value).toFixed(2)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const processData = (data) => {
        return data.map(item => ({
            year: item.year,
            winPercentage: item.winPercentage,
            apRank: item.apRank,
            coachesPollRank: item.coachesPollRank,
            playerCommitterRank: item.playerCommitterRank
        }));
    };

    const processedData = processData(data);

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={processedData}
                margin={{ top: 5, right: 80, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="year"
                    label={{ value: 'Year', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                    yAxisId="left"
                    label={{
                        value: 'Win Percentage (%)',
                        angle: -90,
                        position: 'insideLeft'
                    }}
                />
                <YAxis
                    yAxisId="right"
                    orientation="right"
                    reversed
                    label={{
                        value: 'Rank',
                        angle: -90,
                        position: 'insideRight'
                    }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="winPercentage"
                    name="Win Percentage"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="apRank"
                    name="AP Rank"
                    stroke="#ff8042"
                    activeDot={{ r: 8 }}
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="coachesPollRank"
                    name="Coaches Poll Rank"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                />
                <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="playerCommitterRank"
                    name="Playoff Committee Rank"
                    stroke="#ffc658"
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default CoachingImpactVisualization;