import { WorkersService } from './workers.service';
import { CreateWorkerDto, UpdateWorkerDto } from './workers.dto';
export declare class WorkersController {
    private readonly workersService;
    constructor(workersService: WorkersService);
    findAll(req: any, harvestId?: string): Promise<{
        items: {
            id: string;
            name: string;
            totalBalaios: number;
            totalEarned: number;
            lastRecordDate: string | null;
            createdAt: string;
        }[];
    }>;
    create(req: any, dto: CreateWorkerDto): Promise<{
        id: string;
        name: string;
        createdAt: string;
    }>;
    findOne(req: any, id: string, harvestId?: string): Promise<{
        id: string;
        name: string;
        totalBalaios: number;
        totalEarned: number;
        avgBalaiosPerDay: number;
        createdAt: string;
    }>;
    update(req: any, id: string, dto: UpdateWorkerDto): Promise<{
        id: string;
        name: string;
    }>;
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
