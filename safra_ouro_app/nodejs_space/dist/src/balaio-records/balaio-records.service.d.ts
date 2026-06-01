import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';
export declare class BalaioRecordsService {
    private readonly prisma;
    private readonly settingsService;
    private readonly logger;
    constructor(prisma: PrismaService, settingsService: SettingsService);
    findAll(userId: string, filters: {
        workerId?: string;
        harvestId?: string;
        date?: string;
    }): Promise<{
        items: {
            id: string;
            workerId: string;
            workerName: string;
            harvestId: string;
            date: string;
            quantity: number;
            pricePerBalaio: number;
            totalValue: number;
            createdAt: string;
        }[];
    }>;
    create(userId: string, data: {
        workerId: string;
        harvestId: string;
        date: string;
        quantity: number;
    }): Promise<{
        id: string;
        workerId: string;
        workerName: string;
        harvestId: string;
        date: string;
        quantity: number;
        pricePerBalaio: number;
        totalValue: number;
        createdAt: string;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
