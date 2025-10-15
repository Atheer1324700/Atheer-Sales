import React, { useState, useMemo } from 'react';
import type { Sale } from '../types';

interface DataTableProps {
    data: Sale[];
    onRequestDelete: (sale: Sale) => void;
}

const ROWS_PER_PAGE = 5;

type SortDirection = 'ascending' | 'descending';
type SortableKeys = keyof Omit<Sale, 'customer' | 'id'> | 'customer.name';

interface SortConfig {
    key: SortableKeys;
    direction: SortDirection;
}

const SortIcon: React.FC<{ direction?: SortDirection }> = ({ direction }) => {
    if (!direction) return <span className="opacity-50">▲▼</span>;
    const icon = direction === 'ascending' ? '▲' : '▼';
    return <span className="ml-1 text-xs">{icon}</span>;
}

export const DataTable: React.FC<DataTableProps> = ({ data, onRequestDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: 'date', direction: 'descending' });

    const sortedData = useMemo(() => {
        let sortableItems = [...data];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                let aValue: string | number;
                let bValue: string | number;

                if (sortConfig.key === 'customer.name') {
                    aValue = a.customer.name;
                    bValue = b.customer.name;
                } else {
                    aValue = a[sortConfig.key as keyof Sale];
                    bValue = b[sortConfig.key as keyof Sale];
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [data, sortConfig]);

    const totalPages = Math.ceil(sortedData.length / ROWS_PER_PAGE);

    const paginatedData = sortedData.slice(
        (currentPage - 1) * ROWS_PER_PAGE,
        currentPage * ROWS_PER_PAGE
    );

    const requestSort = (key: SortableKeys) => {
        let direction: SortDirection = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const headers: { key: SortableKeys, label: string }[] = [
        { key: 'product', label: 'المنتج' },
        { key: 'customer.name', label: 'العميل' },
        { key: 'region', label: 'المنطقة' },
        { key: 'date', label: 'التاريخ' },
        { key: 'revenue', label: 'الإيرادات' },
    ];

    const goToNextPage = () => {
        setCurrentPage((page) => Math.min(page + 1, totalPages));
    };

    const goToPreviousPage = () => {
        setCurrentPage((page) => Math.max(page - 1, 1));
    };

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700">
            <h3 className="text-lg font-bold text-white mb-4">أحدث المبيعات</h3>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-right text-gray-400">
                    <thead className="text-xs text-gray-300 uppercase bg-gray-700">
                        <tr>
                            {headers.map((header) => (
                                <th key={header.key} scope="col" className="px-6 py-3">
                                    <button onClick={() => requestSort(header.key)} className="flex items-center gap-2 uppercase">
                                        {header.label}
                                        <SortIcon direction={sortConfig?.key === header.key ? sortConfig.direction : undefined} />
                                    </button>
                                </th>
                            ))}
                            <th scope="col" className="px-6 py-3 text-center uppercase">
                                حذف
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((sale) => (
                            <tr key={sale.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">{sale.product}</th>
                                <td className="px-6 py-4">{sale.customer.name}</td>
                                <td className="px-6 py-4">{sale.region}</td>
                                <td className="px-6 py-4">{sale.date}</td>
                                <td className="px-6 py-4 text-green-400">${sale.revenue.toLocaleString()}</td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        onClick={() => onRequestDelete(sale)}
                                        className="text-gray-400 hover:text-red-500 hover:scale-110 transition-all duration-200 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                        aria-label={`حذف عملية البيع ${sale.product}`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
             <div className="flex justify-between items-center pt-4">
                <button 
                    onClick={goToPreviousPage} 
                    disabled={currentPage === 1}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    السابق
                </button>
                <span className="text-gray-400">
                    صفحة {currentPage} من {totalPages || 1}
                </span>
                <button 
                    onClick={goToNextPage} 
                    disabled={currentPage === totalPages || totalPages === 0}
                    className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    التالي
                </button>
            </div>
        </div>
    );
};