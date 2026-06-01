import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getDashboard(req: any, harvestId?: string): Promise<{
        currentHarvest: null;
        harvests: never[];
        totalSacks: number;
        totalRevenue: number;
        totalExpenses: number;
        totalWorkerPayments: number;
        grandTotalCosts: number;
        netProfit: number;
        profitMargin: number;
        recentActivity: never[];
    } | {
        currentHarvest: {
            id: string;
            name: string;
        };
        harvests: {
            id: string;
            name: string;
        }[];
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
    }>;
}
