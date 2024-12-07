import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Box, Typography } from '@mui/material';

const PlayerImpactVisualization = ({ data }) => {
    // Format the data to include week and year in the x-axis label
    const formattedData = data.map(item => ({
        ...item,
        weekYear: `Week ${item.week}, ${item.season}`
    }));

    // Debug: Log the formatted data
    console.log('Formatted Data:', formattedData);

    return (
        <Box sx={{ p: 4, backgroundColor: 'white', width: '100%', height: 400 }}>
            <Typography variant="h6" sx={{ mb: 2, color: '#212D40' }}>
                Player Impact Visualization
            </Typography>
            {data.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={formattedData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="weekYear" label={{ value: 'Week, Year', position: 'insideBottomRight', offset: 0 }} />
                        <YAxis yAxisId="left" label={{ value: 'Stat Value', angle: -90, position: 'insideLeft' }} />
                        <YAxis yAxisId="right" orientation="right" label={{ value: 'Win % / Rank', angle: -90, position: 'insideRight' }} />
                        <Tooltip />
                        <Legend />
                        <Line yAxisId="left" type="monotone" dataKey="statValue" stroke="#8884d8" activeDot={{ r: 8 }} />
                        <Line yAxisId="right" type="monotone" dataKey="winPercentage" stroke="#82ca9d" />
                        <Line yAxisId="right" type="monotone" dataKey="APTop25Rank" stroke="#ff7300" />
                        <Line yAxisId="right" type="monotone" dataKey="CoachesPollRank" stroke="#387908" />
                        <Line yAxisId="right" type="monotone" dataKey="PlayoffCommitteeRank" stroke="#ff0000" />
                    </LineChart>
                </ResponsiveContainer>
            ) : (
                <Typography color="text.secondary">Loading data...</Typography>
            )}
        </Box>
    );
};

export default PlayerImpactVisualization;
