import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { KpiCard } from './components/KpiCard';
import { FilterButtons } from './components/FilterButtons';
import { SalesChart } from './components/SalesChart';
import { RevenueChart } from './components/RevenueChart';
import { RegionPieChart } from './components/RegionPieChart';
import { DataTable } from './components/DataTable';
import { AiInsightCard } from './components/AiInsightCard';
import { AddSaleModal } from './components/AddSaleModal';
import { DeleteConfirmationModal } from './components/DeleteConfirmationModal'; // Import new component
import { generateMockData } from './hooks/useMockData';
import { getBusinessInsights, getInsightForQuery } from './services/geminiService';
import type { Sale, ChatMessage } from './types';

// Main App component
const App: React.FC = () => {
    // State management
    const [allData, setAllData] = useState<Sale[]>([]);
    const [filteredData, setFilteredData] = useState<Sale[]>([]);
    const [activeFilter, setActiveFilter] = useState('all');
    const [initialInsight, setInitialInsight] = useState('');
    const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
    const [isLoadingInsight, setIsLoadingInsight] = useState(true);
    const [isAnsweringQuery, setIsAnsweringQuery] = useState(false);
    const [insightError, setInsightError] = useState('');
    const [isAddSaleModalOpen, setIsAddSaleModalOpen] = useState(false);
    const [saleToDelete, setSaleToDelete] = useState<Sale | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const loadData = useCallback(() => {
        try {
            const storedData = localStorage.getItem('salesData');
            if (storedData) {
                setAllData(JSON.parse(storedData));
            } else {
                const mockData = generateMockData(200);
                localStorage.setItem('salesData', JSON.stringify(mockData));
                setAllData(mockData);
            }
        } catch (error) {
            console.error("Failed to load or parse sales data:", error);
            const mockData = generateMockData(200);
            setAllData(mockData);
        }
    }, []);

    // Effect for loading data on initial mount
    useEffect(() => {
        loadData();
    }, [loadData]);

    const handleFilterChange = useCallback((days: number | null) => {
        if (days === null) {
            setFilteredData(allData);
            setActiveFilter('all');
        } else {
            const now = new Date();
            const pastDate = new Date();
            pastDate.setDate(now.getDate() - days);
            const filtered = allData.filter(sale => new Date(sale.date) >= pastDate);
            setFilteredData(filtered);
            setActiveFilter(`${days}days`);
        }
    }, [allData]);

    // Apply filter whenever allData changes
    useEffect(() => {
        handleFilterChange(null);
    }, [allData, handleFilterChange]);
    
    const fetchInitialInsight = useCallback(async () => {
        if (allData.length === 0) return;
        setIsLoadingInsight(true);
        setInsightError('');
        setChatHistory([]);
        try {
            const insight = await getBusinessInsights(allData);
            setInitialInsight(insight);
        } catch (error: any) {
            setInsightError(error.message || 'Failed to fetch insights.');
        } finally {
            setIsLoadingInsight(false);
        }
    }, [allData]);

    // Fetch initial insight when data is available
    useEffect(() => {
        if (allData.length > 0) {
            fetchInitialInsight();
        }
    }, [allData, fetchInitialInsight]);

    const handleAskQuery = async (query: string) => {
        if (!query.trim()) return;
        
        const newHistory: ChatMessage[] = [...chatHistory, { sender: 'user', text: query }];
        setChatHistory(newHistory);
        setIsAnsweringQuery(true);
        setInsightError('');

        try {
            const answer = await getInsightForQuery(allData, query);
            setChatHistory([...newHistory, { sender: 'ai', text: answer }]);
        } catch (error: any) {
            setInsightError(error.message || 'Failed to get an answer.');
             setChatHistory(newHistory);
        } finally {
            setIsAnsweringQuery(false);
        }
    };

    const handleSaleAdded = useCallback((newSale: Sale) => {
        const updatedData = [...allData, newSale].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setAllData(updatedData);
        localStorage.setItem('salesData', JSON.stringify(updatedData));
    }, [allData]);

    const requestDeleteConfirmation = (sale: Sale) => {
        setSaleToDelete(sale);
    };

    const handleConfirmDelete = useCallback(() => {
        if (!saleToDelete) return;

        setIsDeleting(true);
        // Simulate network delay
        setTimeout(() => {
            const updatedData = allData.filter(sale => sale.id !== saleToDelete.id);
            setAllData(updatedData);
            localStorage.setItem('salesData', JSON.stringify(updatedData));
            setIsDeleting(false);
            setSaleToDelete(null); // Close modal on success
        }, 500);
    }, [allData, saleToDelete]);


    const kpis = useMemo(() => {
        const totalRevenue = filteredData.reduce((sum, sale) => sum + sale.revenue, 0);
        const totalSales = filteredData.reduce((sum, sale) => sum + sale.unitsSold, 0);
        const totalCustomers = new Set(filteredData.map(sale => sale.customer.id)).size;
        
        return {
            totalRevenue: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`,
            totalSales: totalSales.toLocaleString(),
            totalCustomers: totalCustomers.toLocaleString(),
            avgSaleValue: filteredData.length > 0 ? `$${(totalRevenue / filteredData.length).toFixed(2)}` : '$0.00'
        };
    }, [filteredData]);
    
    return (
        <div className="bg-gray-900 text-white min-h-screen p-4 md:p-8 font-sans" dir="rtl">
            <div className="max-w-7xl mx-auto">
                <Header onAddSaleClick={() => setIsAddSaleModalOpen(true)} />
                <main>
                    <div className="flex justify-start mb-6">
                        <FilterButtons activeFilter={activeFilter} onFilterChange={handleFilterChange} />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <KpiCard title="إجمالي الإيرادات" value={kpis.totalRevenue} description="مجموع الإيرادات للفترة المحددة" />
                        <KpiCard title="إجمالي المبيعات" value={kpis.totalSales} description="مجموع الوحدات المباعة" />
                        <KpiCard title="متوسط قيمة البيع" value={kpis.avgSaleValue} description="متوسط الإيرادات لكل عملية بيع" />
                        <KpiCard title="العملاء الفريدون" value={kpis.totalCustomers} description="عدد العملاء الذين قاموا بالشراء" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                        <div className="lg:col-span-2">
                             <RevenueChart data={filteredData} />
                        </div>
                        <AiInsightCard 
                            initialInsight={initialInsight}
                            chatHistory={chatHistory}
                            isLoading={isLoadingInsight}
                            isAnswering={isAnsweringQuery}
                            error={insightError}
                            onRefresh={fetchInitialInsight}
                            onAsk={handleAskQuery}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                         <SalesChart data={filteredData} />
                         <div className="lg:col-span-2">
                            <RegionPieChart data={filteredData} />
                         </div>
                    </div>

                    <div>
                        <DataTable data={filteredData} onRequestDelete={requestDeleteConfirmation} />
                    </div>
                </main>
            </div>
            {isAddSaleModalOpen && (
                <AddSaleModal 
                    onAddSale={handleSaleAdded}
                    onCancel={() => setIsAddSaleModalOpen(false)} 
                />
            )}
            <DeleteConfirmationModal 
                sale={saleToDelete}
                isDeleting={isDeleting}
                onConfirm={handleConfirmDelete}
                onCancel={() => setSaleToDelete(null)}
            />
        </div>
    );
}

export default App;