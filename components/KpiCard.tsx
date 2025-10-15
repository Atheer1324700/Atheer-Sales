
import React from 'react';
import { AnimatedNumber } from './AnimatedNumber';

interface KpiCardProps {
    title: string;
    value: string;
    description: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, description }) => {
    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h4 className="text-sm font-medium text-gray-400 uppercase">{title}</h4>
            <p className="text-3xl font-bold text-white mt-2">
                <AnimatedNumber value={value} />
            </p>
            <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
    );
};
