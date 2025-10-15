import React from 'react';

interface HeaderProps {
    onAddSaleClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onAddSaleClick }) => {
    return (
        <header className="mb-8 flex justify-between items-center flex-wrap gap-4">
            <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white">لوحة تحكم ذكاء الأعمال</h1>
                <p className="text-gray-400 mt-2">نظرة شاملة ومباشرة على أداء أعمالك الرئيسية.</p>
            </div>
            <button
                onClick={onAddSaleClick}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
            >
                + إضافة عملية بيع
            </button>
        </header>
    );
};