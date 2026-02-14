import React from 'react';
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    AreaChart,
    Area
} from 'recharts';

interface ChartProps {
    data: any[];
    title: string;
}

const DashboardChart: React.FC<ChartProps> = ({ data, title }) => {
    return (
        <div className="dashboard-chart-container" style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            marginTop: '30px',
            marginBottom: '30px'
        }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>{title}</h3>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <AreaChart
                        data={data}
                        margin={{
                            top: 20,
                            right: 30,
                            left: 0,
                            bottom: 0,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis
                            dataKey="date"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#888', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#888', fontSize: 12 }}
                            tickFormatter={(value) => `Rs.${value}`}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                padding: '12px'
                            }}
                            cursor={{ stroke: '#667eea', strokeWidth: 1, strokeDasharray: '5 5' }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <defs>
                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#764ba2" stopOpacity={0.8} />
                                <stop offset="95%" stopColor="#764ba2" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#764ba2"
                            strokeWidth={3}
                            fillOpacity={1}
                            fill="url(#colorValue)"
                            name="Revenue"
                            activeDot={{ r: 8, strokeWidth: 2, stroke: '#fff' }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardChart;
