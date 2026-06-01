import { PrismaService } from '../prisma/prisma.service';
export declare class SettingsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    get(userId: string): Promise<{
        pricePerBalaio: number;
    }>;
    update(userId: string, pricePerBalaio: number): Promise<{
        pricePerBalaio: number;
    }>;
    getPricePerBalaio(userId: string): Promise<number>;
}
