import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const StarPowerVisualization = ({ data }) => {
    if (!data || data.length === 0) {
        return <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            No data available
        </div>;
    }

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            // Sort payload by win rate in descending order
            const sortedPayload = [...payload].sort((a, b) => b.value - a.value);

            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}>
                    <p style={{ margin: 0 }}>Year: {label}</p>
                    {sortedPayload.map((entry) => (
                        <p key={entry.name} style={{
                            color: entry.color,
                            margin: '5px 0 0 0'
                        }}>
                            {entry.name}: {Number(entry.value).toFixed(2)}%<br />
                            Avg Recruit Rating: {entry.payload[`${entry.name} Avg Recruit Rating`]?.toFixed(2)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const processData = (data) => {
        const groupedData = data.reduce((acc, item) => {
            const year = item.year;
            const teamKey = item.school;
            if (!acc[year]) {
                acc[year] = { year: year };
            }
            acc[year][teamKey] = item.winRate;
            acc[year][`${teamKey} Avg Recruit Rating`] = item.averageRecruitRating;
            return acc;
        }, {});

        return Object.values(groupedData);
    };

    const processedData = processData(data);

    console.log('Processed Data:', processedData);

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
                    label={{
                        value: 'Win Rate (%)',
                        angle: -90,
                        position: 'insideLeft'
                    }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                {Object.keys(processedData[0] || {}).filter(key => !key.endsWith('Avg Recruit Rating') && key !== 'year').map((teamKey, index) => (
                    <Line
                        key={teamKey}
                        type="monotone"
                        dataKey={teamKey}
                        name={teamKey}
                        stroke={`hsl(${index * 30}, 70%, 50%)`}
                        activeDot={{ r: 8 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
};

export default StarPowerVisualization;