import { PrismaService } from '../prisma/prisma.service';
export declare class ProductionRecordsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(userId: string, harvestId?: string): Promise<{
        items: {
            id: string;
            harvestId: string;
            date: string;
            sacks: number;
            notes: string | null;
            createdAt: string;
        }[];
    }>;
    create(userId: string, data: {
        harvestId: string;
        date: string;
        sacks: number;
        notes?: string;
    }): Promise<{
        id: string;
        harvestId: string;
        date: string;
        sacks: number;
        notes: string | null;
        createdAt: string;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
