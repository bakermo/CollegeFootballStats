import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';

const PlayerImpactVisualization = ({ data }) => {
    // Format the data to include week and year in the x-axis label
    const formattedData = data.map(item => ({
        ...item,
        weekYear: `Week ${item.week}, ${item.season}`,
        apTop25Rank: item.apTop25Rank === 0 ? null : item.apTop25Rank,
        coachesPollRank: item.coachesPollRank === 0 ? null : item.coachesPollRank,
        playoffCommitteeRank: item.playoffCommitteeRank === 0 ? null : item.playoffCommitteeRank
    }));

    // Aggregate data for win percentage
    const aggregatedData = formattedData.reduce((acc, item) => {
        const existingItem = acc.find(d => d.season === item.season);
        if (existingItem) {
            existingItem.winPercentage = (existingItem.winPercentage + item.winPercentage) / 2;
        } else {
            acc.push({ ...item });
        }
        return acc;
    }, []);

    // Custom Tooltip
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div style={{
                    backgroundColor: 'white',
                    padding: '10px',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                }}>
                    <p style={{ margin: 0 }}>Week, Year: {label}</p>
                    {payload.map((entry) => (
                        <p key={entry.name} style={{
                            color: entry.color,
                            margin: '5px 0 0 0'
                        }}>
                            {entry.name}: {entry.value === null ? 'Unranked' : Number(entry.value).toFixed(2)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Debug: Log the formatted data
    console.log('Formatted Data:', formattedData);
    console.log('Aggregated Data:', aggregatedData);

    return (
        <Box sx={{ p: 4, backgroundColor: 'white', width: '100%', height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#212D40' }}>
                Player Impact Visualization
            </Typography>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={aggregatedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="season" label={{ value: 'Year', position: 'insideBottomRight', offset: 0 }} />
                        <YAxis yAxisId="left" label={{ value: 'Stat Value', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" domain={[0, 25]} label={{ value: 'Rank', angle: -90, position: 'insideRight' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line yAxisId="right" type="monotone" dataKey="winPercentage" stroke="#82ca9d" />
                    </LineChart>
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="weekYear" label={{ value: 'Week, Year', position: 'insideBottomRight', offset: 0 }} />
                        <YAxis yAxisId="left" label={{ value: 'Stat Value', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" domain={[1, 25]} reversed label={{ value: 'Rank', angle: -90, position: 'insideRight' }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="statValue" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="apTop25Rank" stroke="#ff7300" />
                        <Line yAxisId="right" type="monotone" dataKey="coachesPollRank" stroke="#387908" />
                        <Line yAxisId="right" type="monotone" dataKey="playoffCommitteeRank" stroke="#ff0000" />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <Typography color="text.secondary">No data found.</Typography>
            )}
        </Box>
    );
};

export default PlayerImpactVisualization;
