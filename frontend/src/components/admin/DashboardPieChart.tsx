import React from 'react';
import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

interface ChartProps {
    data: any[];
    title: string;
}

const COLORS = ['#6c5ce7', '#00b894', '#fdcb6e', '#e17055', '#d63031', '#74b9ff'];

const DashboardPieChart: React.FC<ChartProps> = ({ data, title }) => {
    return (
        <div className="dashboard-chart-container" style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            marginTop: '30px',
            marginBottom: '30px',
            flex: 1
        }}>
            <h3 style={{ marginBottom: '20px', color: '#333' }}>{title}</h3>
            <div style={{ width: '100%', height: 400 }}>
                <ResponsiveContainer>
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            labelLine={true}
                            label={({ name, percent }: { name?: string; percent?: number }) => `${name} (${(percent ? percent * 100 : 0).toFixed(0)}%)`}
                            outerRadius={120}
                            innerRadius={60}
                            fill="#8884d8"
                            dataKey="value"
                            paddingAngle={5}
                        >
                            {data.map((_entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                                padding: '10px'
                            }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default DashboardPieChart;
