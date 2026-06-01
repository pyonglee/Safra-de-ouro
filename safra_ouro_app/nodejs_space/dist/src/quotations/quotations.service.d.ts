import { PrismaService } from '../prisma/prisma.service';
export declare class QuotationsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    findAll(userId: string, coffeeType?: string): Promise<{
        items: {
            id: string;
            coffeeType: string;
            pricePerSack: number;
            date: string;
            source: string | null;
            createdAt: string;
        }[];
        latestByType: Record<string, any>;
    }>;
    create(userId: string, data: {
        coffeeType: string;
        pricePerSack: number;
        date: string;
        source?: string;
    }): Promise<{
        id: string;
        coffeeType: string;
        pricePerSack: number;
        date: string;
        source: string | null;
        createdAt: string;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
