import { PrismaService } from '../prisma/prisma.service';
export declare class ExpensesService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    private format;
    findAll(userId: string, filters: {
        harvestId?: string;
        category?: string;
    }): Promise<{
        items: {
            id: any;
            harvestId: any;
            category: any;
            productName: any;
            date: any;
            quantity: number | null;
            unit: any;
            appliedArea: number | null;
            cost: number;
            notes: any;
            createdAt: any;
        }[];
        totalCost: number;
    }>;
    findOne(userId: string, id: string): Promise<{
        id: any;
        harvestId: any;
        category: any;
        productName: any;
        date: any;
        quantity: number | null;
        unit: any;
        appliedArea: number | null;
        cost: number;
        notes: any;
        createdAt: any;
    }>;
    create(userId: string, data: any): Promise<{
        id: any;
        harvestId: any;
        category: any;
        productName: any;
        date: any;
        quantity: number | null;
        unit: any;
        appliedArea: number | null;
        cost: number;
        notes: any;
        createdAt: any;
    }>;
    update(userId: string, id: string, data: any): Promise<{
        id: any;
        harvestId: any;
        category: any;
        productName: any;
        date: any;
        quantity: number | null;
        unit: any;
        appliedArea: number | null;
        cost: number;
        notes: any;
        createdAt: any;
    }>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}
