import { BalaioRecordsService } from './balaio-records.service';
import { CreateBalaioRecordDto } from './balaio-records.dto';
export declare class BalaioRecordsController {
    private readonly balaioRecordsService;
    constructor(balaioRecordsService: BalaioRecordsService);
    findAll(req: any, workerId?: string, harvestId?: string, date?: string): Promise<{
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
    create(req: any, dto: CreateBalaioRecordDto): Promise<{
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
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
