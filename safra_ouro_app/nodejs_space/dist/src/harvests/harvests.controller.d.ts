import { HarvestsService } from './harvests.service';
import { CreateHarvestDto, UpdateHarvestDto } from './harvests.dto';
export declare class HarvestsController {
    private readonly harvestsService;
    constructor(harvestsService: HarvestsService);
    findAll(req: any): Promise<{
        items: {
            id: string;
            name: string;
            salePricePerSack: number;
            totalSacks: number;
            totalRevenue: number;
            totalExpenses: number;
            totalWorkerPayments: number;
            grandTotalCosts: number;
            netProfit: number;
            profitMargin: number;
            createdAt: string;
        }[];
    }>;
    create(req: any, dto: CreateHarvestDto): Promise<{
        id: string;
        name: string;
        salePricePerSack: number;
        startDate: string | null;
        endDate: string | null;
        createdAt: string;
    }>;
    findOne(req: any, id: string): Promise<{
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
    update(req: any, id: string, dto: UpdateHarvestDto): Promise<{
        id: string;
        name: string;
        salePricePerSack: number;
        startDate: string | null;
        endDate: string | null;
    }>;
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
