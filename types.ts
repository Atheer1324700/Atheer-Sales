
export interface Customer {
  id: string;
  name: string;
}

export interface Sale {
  id: string;
  date: string; // YYYY-MM-DD
  product: string;
  category: string;
  region: string;
  revenue: number;
  unitsSold: number;
  customer: Customer;
}

export interface ChatMessage {
    sender: 'ai' | 'user';
    text: string;
}
