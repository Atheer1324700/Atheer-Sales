import React from 'react';
import type { Sale } from '../types';

interface DeleteConfirmationModalProps {
    sale: Sale | null;
    isDeleting: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({ sale, isDeleting, onConfirm, onCancel }) => {
    if (!sale) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" 
            dir="rtl"
            onClick={onCancel}
        >
            <div 
                className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md border border-gray-700 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="text-center">
                    <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-900">
                        <svg className="h-6 w-6 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h3 className="mt-4 text-xl font-bold text-white">تأكيد الحذف</h3>
                    <p className="mt-2 text-sm text-gray-400">
                        هل أنت متأكد من رغبتك في حذف عملية البيع هذه؟ لا يمكن التراجع عن هذا الإجراء.
                    </p>

                    <div className="mt-4 text-sm text-gray-300 bg-gray-700 rounded-lg p-3 text-right space-y-1">
                        <p><strong>المنتج:</strong> {sale.product}</p>
                        <p><strong>العميل:</strong> {sale.customer.name}</p>
                        <p><strong>التاريخ:</strong> {sale.date}</p>
                        <p><strong>الإيرادات:</strong> ${sale.revenue.toLocaleString()}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-center gap-4">
                    <button 
                        onClick={onCancel} 
                        disabled={isDeleting}
                        className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
                    >
                        إلغاء
                    </button>
                    <button 
                        onClick={onConfirm} 
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50 w-32"
                    >
                        {isDeleting ? (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            </div>
                        ) : 'نعم، حذف'}
                    </button>
                </div>
            </div>
        </div>
    );
};
