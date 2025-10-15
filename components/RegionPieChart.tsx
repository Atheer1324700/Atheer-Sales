
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Sale } from '../types';

interface RegionPieChartProps {
    data: Sale[];
}

const COLORS = ['#6366F1', '#2DD4BF', '#F472B6', '#FBBF24', '#A78BFA'];

export const RegionPieChart: React.FC<RegionPieChartProps> = ({ data }) => {
    const chartData = useMemo(() => {
        const salesByRegion = data.reduce((acc, sale) => {
            acc[sale.region] = (acc[sale.region] || 0) + sale.revenue;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(salesByRegion).map(([name, value]) => ({ name, value }));
    }, [data]);

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-96">
            <h3 className="text-lg font-bold text-white mb-4">الإيرادات حسب المنطقة</h3>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                        {chartData.map((_entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip 
                         contentStyle={{ 
                            backgroundColor: '#1A202C', 
                            border: '1px solid #4A5568',
                            color: '#FFFFFF'
                        }}
                    />
                    <Legend wrapperStyle={{color: '#FFFFFF'}} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
