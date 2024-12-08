// src/components/ConferenceEvolutionVisualization.jsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ConferenceEvolutionVisualization = ({ data }) => {
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
                    <p style={{ margin: 0 }}>Season: {label}</p>
                    {payload.map((entry) => (
                        <p key={entry.name} style={{
                            color: entry.color,
                            margin: '5px 0 0 0'
                        }}>
                            {entry.name}: {Number(entry.value).toFixed(1)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                    dataKey="season"
                    label={{ value: 'Season', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                    label={{
                        value: 'Points per Game',
                        angle: -90,
                        position: 'insideLeft'
                    }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="avgPointsScored"
                    name="Points Scored/Game"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
                <Line
                    type="monotone"
                    dataKey="avgPointsAllowed"
                    name="Points Allowed/Game"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                />
                <Line
                    type="monotone"
                    dataKey="pointDifferential"
                    name="Point Differential"
                    stroke="#ffc658"
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default ConferenceEvolutionVisualization;