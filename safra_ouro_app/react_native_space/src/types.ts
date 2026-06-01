export interface User {
  id: string;
  email: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Settings {
  pricePerBalaio: number;
}

export interface Worker {
  id: string;
  name: string;
  totalBalaios?: number;
  totalEarned?: number;
  lastRecordDate?: string | null;
  avgBalaiosPerDay?: number;
  createdAt: string;
}

export interface BalaioRecord {
  id: string;
  workerId: string;
  workerName: string;
  harvestId: string;
  date: string;
  quantity: number;
  pricePerBalaio: number;
  totalValue: number;
  createdAt: string;
}

export interface Harvest {
  id: string;
  name: string;
  salePricePerSack: number;
  startDate?: string | null;
  endDate?: string | null;
  totalSacks?: number;
  totalRevenue?: number;
  totalExpenses?: number;
  totalWorkerPayments?: number;
  grandTotalCosts?: number;
  netProfit?: number;
  profitMargin?: number;
  createdAt: string;
}

export interface HarvestDetail extends Harvest {
  totalExpenses: number;
  totalWorkerPayments: number;
  grandTotalCosts: number;
  expenseBreakdown: {
    fertilizer: number;
    spraying: number;
    other: number;
  };
  productionRecords: ProductionRecord[];
}

export interface ProductionRecord {
  id: string;
  harvestId: string;
  date: string;
  sacks: number;
  notes?: string | null;
  createdAt: string;
}

export interface Expense {
  id: string;
  harvestId: string;
  category: 'FERTILIZER' | 'SPRAYING' | 'OTHER';
  productName: string;
  date: string;
  quantity?: number | null;
  unit?: string | null;
  appliedArea?: number | null;
  cost: number;
  notes?: string | null;
  createdAt: string;
}

export interface Quotation {
  id: string;
  coffeeType: string;
  pricePerSack: number;
  date: string;
  source?: string | null;
  createdAt: string;
}

export interface QuotationLatest {
  current: { pricePerSack: number; date: string };
  previous: { pricePerSack: number; date: string } | null;
  trend: 'up' | 'down' | 'stable';
}

export interface DashboardData {
  currentHarvest: { id: string; name: string } | null;
  harvests: { id: string; name: string }[];
  totalSacks: number;
  totalRevenue: number;
  totalExpenses: number;
  totalWorkerPayments: number;
  grandTotalCosts: number;
  netProfit: number;
  profitMargin: number;
  recentActivity: {
    type: string;
    description: string;
    date: string;
    value: number;
  }[];
}

export interface ExpenseReport {
  byCategory: {
    category: string;
    total: number;
    items: { productName: string; totalCost: number; totalQuantity: number | null; unit: string | null }[];
  }[];
  grandTotal: number;
  harvestName: string | null;
}

export interface WorkerReport {
  workers: {
    id: string;
    name: string;
    totalBalaios: number;
    totalEarned: number;
    records: { date: string; quantity: number; pricePerBalaio: number; totalValue: number }[];
  }[];
  grandTotalBalaios: number;
  grandTotalPaid: number;
  harvestName: string | null;
}

export interface ProductionReport {
  harvests: {
    id: string;
    name: string;
    totalSacks: number;
    salePricePerSack: number;
    totalRevenue: number;
  }[];
  grandTotalSacks: number;
  grandTotalRevenue: number;
}

export interface ProfitReport {
  harvestName: string | null;
  totalRevenue: number;
  expenseBreakdown: { category: string; total: number }[];
  totalExpenses: number;
  totalWorkerPayments: number;
  grandTotalCosts: number;
  netProfit: number;
  profitMargin: number;
}
