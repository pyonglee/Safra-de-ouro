import { PrismaService } from '../prisma/prisma.service';
export declare class WorkersService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(userId: string, harvestId?: string): Promise<{
        items: {
            id: string;
            name: string;
            totalBalaios: number;
            totalEarned: number;
            lastRecordDate: string | null;
            createdAt: string;
        }[];
    }>;
    findOne(userId: string, id: string, harvestId?: string): Promise<{
        id: string;
        name: string;
        totalBalaios: number;
        totalEarned: number;
        avgBalaiosPerDay: number;
        createdAt: string;
    }>;
    create(userId: string, name: string): Promise<{
        id: string;
        name: string;
        createdAt: string;
    }>;
    update(userId: string, id: string, name: string): Promise<{
        id: string;
        name: string;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
