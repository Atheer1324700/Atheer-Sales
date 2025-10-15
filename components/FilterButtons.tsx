
import React from 'react';

interface FilterButtonsProps {
    activeFilter: string;
    onFilterChange: (days: number | null) => void;
}

const filters = [
    { label: 'آخر 7 أيام', value: '7days', days: 7 },
    { label: 'آخر 30 يومًا', value: '30days', days: 30 },
    { label: 'آخر 90 يومًا', value: '90days', days: 90 },
    { label: 'كل الوقت', value: 'all', days: null },
];

export const FilterButtons: React.FC<FilterButtonsProps> = ({ activeFilter, onFilterChange }) => {
    return (
        <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
                <button
                    key={filter.value}
                    onClick={() => onFilterChange(filter.days)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                        activeFilter === filter.value
                            ? 'bg-cyan-500 text-white shadow-md'
                            : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
};
