import React, { useState } from 'react';
import type { Sale } from '../types';
import { REGIONS, CATEGORIES } from '../hooks/useMockData';

const today = new Date().toISOString().split('T')[0];

interface AddSaleModalProps {
    onAddSale: (sale: Sale) => void;
    onCancel: () => void;
}

export const AddSaleModal: React.FC<AddSaleModalProps> = ({ onAddSale, onCancel }) => {
    // Form state
    const [category, setCategory] = useState('');
    const [product, setProduct] = useState('');
    const [region, setRegion] = useState('');
    const [unitsSold, setUnitsSold] = useState(1);
    const [price, setPrice] = useState(100);
    const [customerName, setCustomerName] = useState('');
    const [date, setDate] = useState(today);
    
    // Component control state
    const [error, setError] = useState('');
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [lastAddedSale, setLastAddedSale] = useState<Omit<Sale, 'id'> | null>(null);

    const resetForm = () => {
        setCategory('');
        setProduct('');
        setRegion('');
        setUnitsSold(1);
        setPrice(100);
        setCustomerName('');
        setDate(today);
        setError('');
        setLastAddedSale(null);
        setStatus('idle');
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!category || !product.trim() || !region || !customerName.trim()) {
            setError('يرجى ملء جميع الحقول المطلوبة.');
            return;
        }
        if (unitsSold <= 0 || price < 0) {
            setError('يجب أن تكون الوحدات المباعة والسعر أرقامًا موجبة.');
            return;
        }

        setStatus('submitting');

        const newCustomer = {
            id: `cust_${Date.now()}_${Math.random()}`,
            name: customerName.trim(),
        };

        const newSaleData: Omit<Sale, 'id'> = {
            date: date,
            product: product.trim(),
            category: category,
            region: region,
            revenue: parseFloat((unitsSold * price).toFixed(2)),
            unitsSold: unitsSold,
            customer: newCustomer,
        };
        
        // Simulate a network request
        setTimeout(() => {
            try {
                const saleToAdd: Sale = { ...newSaleData, id: `sale_${Date.now()}` };
                onAddSale(saleToAdd); // Pass the full sale object to the parent
                
                setLastAddedSale(newSaleData);
                setStatus('success');
            } catch (err) {
                console.error("Error during sale submission:", err);
                setError("فشل إضافة البيانات. يرجى المحاولة مرة أخرى.");
                setStatus('idle');
            }
        }, 500);
    };

    const renderSuccessView = () => (
        <div className="text-center">
            <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-xl font-bold text-white">تمت إضافة البيع بنجاح!</h3>
            
            <div className="mt-4 text-sm text-gray-300 bg-gray-700 rounded-lg p-4 text-right space-y-2">
                 <h4 className="font-bold text-white mb-2 text-center">ملخص العملية</h4>
                <p><strong>المنتج:</strong> {lastAddedSale?.product}</p>
                <p><strong>العميل:</strong> {lastAddedSale?.customer.name}</p>
                <p><strong>الإيرادات:</strong> ${lastAddedSale?.revenue.toLocaleString()}</p>
                <p><strong>التاريخ:</strong> {lastAddedSale?.date}</p>
            </div>

            <div className="mt-8 flex justify-center gap-4">
                <button 
                    onClick={onCancel} 
                    className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                    إغلاق
                </button>
                <button 
                    onClick={resetForm} 
                    className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
                >
                    إضافة عملية بيع أخرى
                </button>
            </div>
        </div>
    );
    
    const renderForm = () => (
        <>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">إضافة عملية بيع جديدة</h2>
                <button onClick={onCancel} className="text-gray-400 hover:text-white text-2xl font-bold">&times;</button>
            </div>
            {error && <p className="bg-red-900 border border-red-700 text-red-300 text-sm rounded-lg p-3 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <fieldset disabled={status === 'submitting'} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                           <label htmlFor="category" className="block text-sm font-medium text-gray-300 mb-1">الفئة</label>
                           <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" required>
                                <option value="" disabled>اختر فئة...</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                        </div>
                        <div>
                            <label htmlFor="product" className="block text-sm font-medium text-gray-300 mb-1">المنتج</label>
                            <input
                                type="text"
                                id="product"
                                value={product}
                                onChange={e => setProduct(e.target.value)}
                                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition"
                                required
                                placeholder="ادخل اسم المنتج"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="region" className="block text-sm font-medium text-gray-300 mb-1">المنطقة</label>
                            <select id="region" value={region} onChange={e => setRegion(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" required>
                                <option value="" disabled>اختر منطقة...</option>
                                {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                         <div>
                            <label htmlFor="customer" className="block text-sm font-medium text-gray-300 mb-1">العميل</label>
                            <input type="text" id="customer" value={customerName} onChange={e => setCustomerName(e.target.value)} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" required placeholder="ادخل اسم العميل" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <div>
                             <label htmlFor="unitsSold" className="block text-sm font-medium text-gray-300 mb-1">الوحدات المباعة</label>
                             <input type="number" id="unitsSold" value={unitsSold} onChange={e => setUnitsSold(Number(e.target.value))} min="1" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" required />
                        </div>
                        <div>
                             <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-1">السعر للوحدة ($)</label>
                             <input type="number" id="price" value={price} onChange={e => setPrice(Number(e.target.value))} min="0" step="0.01" className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" required />
                        </div>
                    </div>

                    <div>
                         <label htmlFor="date" className="block text-sm font-medium text-gray-300 mb-1">تاريخ البيع</label>
                         <input type="date" id="date" value={date} onChange={e => setDate(e.target.value)} max={today} className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition" required />
                    </div>
                </fieldset>
                
                <div className="flex justify-end gap-4 pt-4">
                    <button type="button" onClick={onCancel} disabled={status === 'submitting'} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50">إلغاء</button>
                    <button type="submit" disabled={status === 'submitting'} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 w-40 text-center">
                        {status === 'idle' && 'إضافة عملية البيع'}
                        {status === 'submitting' && (
                            <div className="flex items-center justify-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>جار الإضافة...</span>
                            </div>
                        )}
                    </button>
                </div>
            </form>
        </>
    );

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" 
            dir="rtl"
            onClick={onCancel}
        >
            <div 
                className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-2xl border border-gray-700 animate-fade-in-scale"
                onClick={(e) => e.stopPropagation()}
            >
                {status === 'success' ? renderSuccessView() : renderForm()}
            </div>
        </div>
    );
};