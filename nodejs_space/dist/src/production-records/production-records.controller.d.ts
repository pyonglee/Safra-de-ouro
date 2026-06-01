import { ProductionRecordsService } from './production-records.service';
import { CreateProductionRecordDto } from './production-records.dto';
export declare class ProductionRecordsController {
    private readonly service;
    constructor(service: ProductionRecordsService);
    findAll(req: any, harvestId?: string): Promise<{
        items: {
            id: string;
            harvestId: string;
            date: string;
            sacks: number;
            notes: string | null;
            createdAt: string;
        }[];
    }>;
    create(req: any, dto: CreateProductionRecordDto): Promise<{
        id: string;
        harvestId: string;
        date: string;
        sacks: number;
        notes: string | null;
        createdAt: string;
    }>;
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
