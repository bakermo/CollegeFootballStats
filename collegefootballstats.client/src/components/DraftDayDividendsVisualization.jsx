import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DraftDayDividendsVisualization = ({ data }) => {
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
                    <p style={{ margin: 0 }}>Draft Year: {label}</p>
                    {payload.map((entry) => (
                        <p key={entry.name} style={{
                            color: entry.color,
                            margin: '5px 0 0 0'
                        }}>
                            {entry.name}: {Number(entry.value).toFixed(2)}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    const processData = (data) => {
        const groupedData = data.reduce((acc, item) => {
            const year = item.draftYear;
            if (!acc[year]) {
                acc[year] = { draftYear: year };
            }
            switch (item.percentile) {
                case 1:
                    acc[year]['Top 25%'] = item.averageOverallPick;
                    break;
                case 2:
                    acc[year]['50th to 75th Percentile'] = item.averageOverallPick;
                    break;
                case 3:
                    acc[year]['25th to 50th Percentile'] = item.averageOverallPick;
                    break;
                case 4:
                    acc[year]['Bottom 25%'] = item.averageOverallPick;
                    break;
                default:
                    break;
            }
            return acc;
        }, {});

        return Object.values(groupedData);
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
                    dataKey="draftYear"
                    label={{ value: 'Draft Year', position: 'insideBottom', offset: -5 }}
                />
                <YAxis
                    reversed
                    label={{
                        value: 'Average Overall Pick',
                        angle: -90,
                        position: 'insideLeft'
                    }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="Top 25%"
                    name="Top 25%"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                />
                <Line
                    type="monotone"
                    dataKey="50th to 75th Percentile"
                    name="50th to 75th Percentile"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                />
                <Line
                    type="monotone"
                    dataKey="25th to 50th Percentile"
                    name="25th to 50th Percentile"
                    stroke="#ffc658"
                    activeDot={{ r: 8 }}
                />
                <Line
                    type="monotone"
                    dataKey="Bottom 25%"
                    name="Bottom 25%"
                    stroke="#ff8042"
                    activeDot={{ r: 8 }}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default DraftDayDividendsVisualization;