import { PrismaService } from '../prisma/prisma.service';
export declare class HarvestsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(userId: string): Promise<{
        items: {
            id: string;
            name: string;
            salePricePerSack: number;
            totalSacks: number;
            totalRevenue: number;
            netProfit: number;
            profitMargin: number;
            createdAt: string;
        }[];
    }>;
    findOne(userId: string, id: string): Promise<{
        id: string;
        name: string;
        salePricePerSack: number;
        startDate: string | null;
        endDate: string | null;
        totalSacks: number;
        totalRevenue: number;
        totalExpenses: number;
        totalWorkerPayments: number;
        grandTotalCosts: number;
        netProfit: number;
        profitMargin: number;
        expenseBreakdown: {
            fertilizer: number;
            spraying: number;
            other: number;
        };
        productionRecords: {
            id: string;
            harvestId: string;
            date: string;
            sacks: number;
            notes: string | null;
            createdAt: string;
        }[];
        createdAt: string;
    }>;
    create(userId: string, data: {
        name: string;
        salePricePerSack: number;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        id: string;
        name: string;
        salePricePerSack: number;
        startDate: string | null;
        endDate: string | null;
        createdAt: string;
    }>;
    update(userId: string, id: string, data: {
        name?: string;
        salePricePerSack?: number;
        startDate?: string;
        endDate?: string;
    }): Promise<{
        id: string;
        name: string;
        salePricePerSack: number;
        startDate: string | null;
        endDate: string | null;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
    getLatestHarvest(userId: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        salePricePerSack: import(".prisma/client/runtime/library").Decimal;
        startDate: Date | null;
        endDate: Date | null;
    } | null>;
}
