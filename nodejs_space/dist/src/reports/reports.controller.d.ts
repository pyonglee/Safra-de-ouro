import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    getExpenseReport(req: any, harvestId?: string, startDate?: string, endDate?: string): Promise<{
        byCategory: {
            category: string;
            total: number;
            items: {
                productName: string;
                totalCost: number;
                totalQuantity: number | null;
                unit: string | null;
            }[];
        }[];
        grandTotal: number;
        harvestName: string | null;
    }>;
    getWorkerReport(req: any, harvestId?: string): Promise<{
        workers: {
            id: string;
            name: string;
            totalBalaios: number;
            totalEarned: number;
            records: any[];
        }[];
        grandTotalBalaios: number;
        grandTotalPaid: number;
        harvestName: string | null;
    }>;
    getProductionReport(req: any, harvestId?: string): Promise<{
        harvests: {
            id: string;
            name: string;
            totalSacks: number;
            salePricePerSack: number;
            totalRevenue: number;
        }[];
        grandTotalSacks: number;
        grandTotalRevenue: number;
    }>;
    getProfitReport(req: any, harvestId?: string): Promise<{
        harvestName: string | null;
        totalRevenue: number;
        expenseBreakdown: {
            category: string;
            total: number;
        }[];
        totalExpenses: number;
        totalWorkerPayments: number;
        grandTotalCosts: number;
        netProfit: number;
        profitMargin: number;
    }>;
}
