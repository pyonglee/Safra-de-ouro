import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from './expenses.dto';
export declare class ExpensesController {
    private readonly expensesService;
    constructor(expensesService: ExpensesService);
    findAll(req: any, harvestId?: string, category?: string): Promise<{
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
    create(req: any, dto: CreateExpenseDto): Promise<{
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
    findOne(req: any, id: string): Promise<{
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
    update(req: any, id: string, dto: UpdateExpenseDto): Promise<{
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
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}
