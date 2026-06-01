import { QuotationsService } from './quotations.service';
import { CreateQuotationDto } from './quotations.dto';
export declare class QuotationsController {
    private readonly quotationsService;
    constructor(quotationsService: QuotationsService);
    findAll(req: any, coffeeType?: string): Promise<{
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
    create(req: any, dto: CreateQuotationDto): Promise<{
        id: string;
        coffeeType: string;
        pricePerSack: number;
        date: string;
        source: string | null;
        createdAt: string;
    }>;
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
