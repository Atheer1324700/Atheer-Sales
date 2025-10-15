
import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Sale } from '../types';

interface SalesChartProps {
    data: Sale[];
}

export const SalesChart: React.FC<SalesChartProps> = ({ data }) => {
    const chartData = useMemo(() => {
        const salesByCategory = data.reduce((acc, sale) => {
            acc[sale.category] = (acc[sale.category] || 0) + sale.unitsSold;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(salesByCategory).map(([name, sales]) => ({ name, 'الوحدات المباعة': sales }));
    }, [data]);

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-96">
            <h3 className="text-lg font-bold text-white mb-4">المبيعات حسب الفئة</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="name" stroke="#A0AEC0" tick={{ fill: '#A0AEC0', fontSize: 12 }} />
                    <YAxis stroke="#A0AEC0" tick={{ fill: '#A0AEC0', fontSize: 12 }} />
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1A202C', 
                            border: '1px solid #4A5568',
                            color: '#FFFFFF'
                        }}
                    />
                    <Legend wrapperStyle={{color: '#FFFFFF'}} />
                    <Bar dataKey="الوحدات المباعة" fill="#2DD4BF" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};
