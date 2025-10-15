import type { Sale, Customer } from '../types';

export const PRODUCT_CATALOG = [
  { product: 'لابتوب Pro', category: 'إلكترونيات' },
  { product: 'لابتوب Gamer', category: 'إلكترونيات' },
  { product: 'شاشة UltraWide', category: 'إلكترونيات' },
  { product: 'هاتف SmartX', category: 'هواتف' },
  { product: 'هاتف SmartX Plus', category: 'هواتف' },
  { product: 'سماعات SoundWave', category: 'صوتيات' },
  { product: 'سماعات Buds', category: 'صوتيات' },
  { product: 'ساعة Chrono', category: 'اكسسوارات' },
  { product: 'كاميرا Vision', category: 'كاميرات' },
];

export const CATEGORIES = [...new Set(PRODUCT_CATALOG.map(p => p.category))];
export const REGIONS = ['الرياض', 'جدة', 'الدمام', 'مكة', 'المدينة'];

export const CUSTOMERS: Customer[] = [
    { id: 'c1', name: 'أحمد المحمد' },
    { id: 'c2', name: 'فاطمة العلي' },
    { id: 'c3', name: 'خالد الصالح' },
    { id: 'c4', name: 'نورة التركي' },
    { id: 'c5', name: 'سارة عبدالله' },
];

export const generateMockData = (count: number): Sale[] => {
    const data: Sale[] = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() - Math.floor(Math.random() * 365));
        
        const productDetails = PRODUCT_CATALOG[Math.floor(Math.random() * PRODUCT_CATALOG.length)];
        const { product, category } = productDetails;

        const unitsSold = Math.floor(Math.random() * 10) + 1;
        const price = 100 + Math.random() * 1900;

        data.push({
            id: `sale_${i + 1}`,
            date: date.toISOString().split('T')[0],
            product,
            category,
            region: REGIONS[Math.floor(Math.random() * REGIONS.length)],
            revenue: parseFloat((unitsSold * price).toFixed(2)),
            unitsSold,
            customer: CUSTOMERS[Math.floor(Math.random() * CUSTOMERS.length)],
        });
    }
    return data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};