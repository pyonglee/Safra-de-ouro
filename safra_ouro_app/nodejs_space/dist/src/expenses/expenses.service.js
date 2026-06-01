"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ExpensesService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpensesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ExpensesService = ExpensesService_1 = class ExpensesService {
    prisma;
    logger = new common_1.Logger(ExpensesService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    format(e) {
        return {
            id: e.id,
            harvestId: e.harvestId,
            category: e.category,
            productName: e.productName,
            date: e.date.toISOString(),
            quantity: e.quantity ? Number(e.quantity) : null,
            unit: e.unit,
            appliedArea: e.appliedArea ? Number(e.appliedArea) : null,
            cost: Number(e.cost),
            notes: e.notes,
            createdAt: e.createdAt.toISOString(),
        };
    }
    async findAll(userId, filters) {
        const where = { userId };
        if (filters.harvestId)
            where.harvestId = filters.harvestId;
        if (filters.category)
            where.category = filters.category;
        const expenses = await this.prisma.expense.findMany({
            where,
            orderBy: { date: 'desc' },
        });
        const totalCost = expenses.reduce((sum, e) => sum + Number(e.cost), 0);
        return {
            items: expenses.map((e) => this.format(e)),
            totalCost,
        };
    }
    async findOne(userId, id) {
        const expense = await this.prisma.expense.findFirst({ where: { id, userId } });
        if (!expense)
            throw new common_1.NotFoundException('Expense not found');
        return this.format(expense);
    }
    async create(userId, data) {
        const harvest = await this.prisma.harvest.findFirst({ where: { id: data.harvestId, userId } });
        if (!harvest)
            throw new common_1.NotFoundException('Harvest not found');
        const expense = await this.prisma.expense.create({
            data: {
                userId,
                harvestId: data.harvestId,
                category: data.category,
                productName: data.productName,
                date: new Date(data.date),
                quantity: data.quantity ?? null,
                unit: data.unit ?? null,
                appliedArea: data.appliedArea ?? null,
                cost: data.cost,
                notes: data.notes ?? null,
            },
        });
        this.logger.log(`Expense created: ${data.productName} - R$ ${data.cost}`);
        return this.format(expense);
    }
    async update(userId, id, data) {
        const existing = await this.prisma.expense.findFirst({ where: { id, userId } });
        if (!existing)
            throw new common_1.NotFoundException('Expense not found');
        const updateData = {};
        if (data.category !== undefined)
            updateData.category = data.category;
        if (data.productName !== undefined)
            updateData.productName = data.productName;
        if (data.date !== undefined)
            updateData.date = new Date(data.date);
        if (data.quantity !== undefined)
            updateData.quantity = data.quantity;
        if (data.unit !== undefined)
            updateData.unit = data.unit;
        if (data.appliedArea !== undefined)
            updateData.appliedArea = data.appliedArea;
        if (data.cost !== undefined)
            updateData.cost = data.cost;
        if (data.notes !== undefined)
            updateData.notes = data.notes;
        const expense = await this.prisma.expense.update({ where: { id }, data: updateData });
        return this.format(expense);
    }
    async remove(userId, id) {
        const existing = await this.prisma.expense.findFirst({ where: { id, userId } });
        if (!existing)
            throw new common_1.NotFoundException('Expense not found');
        await this.prisma.expense.delete({ where: { id } });
        return { success: true };
    }
};
exports.ExpensesService = ExpensesService;
exports.ExpensesService = ExpensesService = ExpensesService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ExpensesService);
//# sourceMappingURL=expenses.service.js.map