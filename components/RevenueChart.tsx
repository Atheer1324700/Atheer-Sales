
import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Sale } from '../types';

interface RevenueChartProps {
  data: Sale[];
}

export const RevenueChart: React.FC<RevenueChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const revenueByDate = data.reduce((acc, sale) => {
        const date = new Date(sale.date).toLocaleDateString('ar-EG-u-nu-latn', { month: 'short', day: 'numeric' });
        acc[date] = (acc[date] || 0) + sale.revenue;
        return acc;
    }, {} as Record<string, number>);

    return Object.entries(revenueByDate)
        .map(([date, revenue]) => ({ date, "الإيرادات": revenue }))
        .slice(-30); // Show last 30 data points for clarity
  }, [data]);

  return (
    <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 h-96">
      <h3 className="text-lg font-bold text-white mb-4">اتجاه الإيرادات</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
          <XAxis dataKey="date" stroke="#A0AEC0" tick={{ fill: '#A0AEC0', fontSize: 12 }} />
          <YAxis stroke="#A0AEC0" tick={{ fill: '#A0AEC0', fontSize: 12 }} />
          <Tooltip 
            contentStyle={{ 
                backgroundColor: '#1A202C', 
                border: '1px solid #4A5568',
                color: '#FFFFFF'
            }}
          />
          <Legend wrapperStyle={{color: '#FFFFFF'}} />
          <Line type="monotone" dataKey="الإيرادات" stroke="#6366F1" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
