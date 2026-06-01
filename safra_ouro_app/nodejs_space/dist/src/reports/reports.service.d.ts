import { PrismaService } from '../prisma/prisma.service';
export declare class ReportsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    getExpenseReport(userId: string, filters: {
        harvestId?: string;
        startDate?: string;
        endDate?: string;
    }): Promise<{
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
    getWorkerReport(userId: string, harvestId?: string): Promise<{
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
    getProductionReport(userId: string, harvestId?: string): Promise<{
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
    getProfitReport(userId: string, harvestId?: string): Promise<{
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
