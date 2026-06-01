import { PrismaService } from '../prisma/prisma.service';
import { HarvestsService } from '../harvests/harvests.service';
export declare class DashboardService {
    private readonly prisma;
    private readonly harvestsService;
    private readonly logger;
    constructor(prisma: PrismaService, harvestsService: HarvestsService);
    getDashboard(userId: string, harvestId?: string): Promise<{
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
