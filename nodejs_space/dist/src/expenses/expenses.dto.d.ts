export declare class CreateExpenseDto {
    harvestId: string;
    category: string;
    productName: string;
    date: string;
    quantity?: number;
    unit?: string;
    appliedArea?: number;
    cost: number;
    notes?: string;
}
export declare class UpdateExpenseDto {
    category?: string;
    productName?: string;
    date?: string;
    quantity?: number;
    unit?: string;
    appliedArea?: number;
    cost?: number;
    notes?: string;
}
