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
var HarvestsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.HarvestsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let HarvestsService = HarvestsService_1 = class HarvestsService {
    prisma;
    logger = new common_1.Logger(HarvestsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId) {
        const harvests = await this.prisma.harvest.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            include: {
                productionRecords: true,
                expenses: true,
                balaioRecords: true,
            },
        });
        const items = harvests.map((h) => {
            const totalSacks = h.productionRecords.reduce((sum, p) => sum + p.sacks, 0);
            const totalRevenue = totalSacks * Number(h.salePricePerSack);
            const totalExpenses = h.expenses.reduce((sum, e) => sum + Number(e.cost), 0);
            const totalWorkerPayments = h.balaioRecords.reduce((sum, b) => sum + Number(b.totalValue), 0);
            const grandTotalCosts = totalExpenses + totalWorkerPayments;
            const netProfit = totalRevenue - grandTotalCosts;
            const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
            return {
                id: h.id,
                name: h.name,
                salePricePerSack: Number(h.salePricePerSack),
                totalSacks,
                totalRevenue,
                netProfit,
                profitMargin: Math.round(profitMargin * 100) / 100,
                createdAt: h.createdAt.toISOString(),
            };
        });
        return { items };
    }
    async findOne(userId, id) {
        const h = await this.prisma.harvest.findFirst({
            where: { id, userId },
            include: {
                productionRecords: { orderBy: { date: 'desc' } },
                expenses: true,
                balaioRecords: true,
            },
        });
        if (!h)
            throw new common_1.NotFoundException('Harvest not found');
        const totalSacks = h.productionRecords.reduce((sum, p) => sum + p.sacks, 0);
        const totalRevenue = totalSacks * Number(h.salePricePerSack);
        const totalExpenses = h.expenses.reduce((sum, e) => sum + Number(e.cost), 0);
        const totalWorkerPayments = h.balaioRecords.reduce((sum, b) => sum + Number(b.totalValue), 0);
        const grandTotalCosts = totalExpenses + totalWorkerPayments;
        const netProfit = totalRevenue - grandTotalCosts;
        const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
        const fertilizerCost = h.expenses.filter(e => e.category === 'FERTILIZER').reduce((s, e) => s + Number(e.cost), 0);
        const sprayingCost = h.expenses.filter(e => e.category === 'SPRAYING').reduce((s, e) => s + Number(e.cost), 0);
        const otherCost = h.expenses.filter(e => e.category === 'OTHER').reduce((s, e) => s + Number(e.cost), 0);
        return {
            id: h.id,
            name: h.name,
            salePricePerSack: Number(h.salePricePerSack),
            startDate: h.startDate ? h.startDate.toISOString() : null,
            endDate: h.endDate ? h.endDate.toISOString() : null,
            totalSacks,
            totalRevenue,
            totalExpenses,
            totalWorkerPayments,
            grandTotalCosts,
            netProfit,
            profitMargin: Math.round(profitMargin * 100) / 100,
            expenseBreakdown: {
                fertilizer: fertilizerCost,
                spraying: sprayingCost,
                other: otherCost,
            },
            productionRecords: h.productionRecords.map((p) => ({
                id: p.id,
                harvestId: p.harvestId,
                date: p.date.toISOString(),
                sacks: p.sacks,
                notes: p.notes,
                createdAt: p.createdAt.toISOString(),
            })),
            createdAt: h.createdAt.toISOString(),
        };
    }
    async create(userId, data) {
        const harvest = await this.prisma.harvest.create({
            data: {
                userId,
                name: data.name,
                salePricePerSack: data.salePricePerSack,
                startDate: data.startDate ? new Date(data.startDate) : null,
                endDate: data.endDate ? new Date(data.endDate) : null,
            },
        });
        this.logger.log(`Harvest created: ${harvest.name}`);
        return {
            id: harvest.id,
            name: harvest.name,
            salePricePerSack: Number(harvest.salePricePerSack),
            startDate: harvest.startDate ? harvest.startDate.toISOString() : null,
            endDate: harvest.endDate ? harvest.endDate.toISOString() : null,
            createdAt: harvest.createdAt.toISOString(),
        };
    }
    async update(userId, id, data) {
        const existing = await this.prisma.harvest.findFirst({ where: { id, userId } });
        if (!existing)
            throw new common_1.NotFoundException('Harvest not found');
        const updateData = {};
        if (data.name !== undefined)
            updateData.name = data.name;
        if (data.salePricePerSack !== undefined)
            updateData.salePricePerSack = data.salePricePerSack;
        if (data.startDate !== undefined)
            updateData.startDate = data.startDate ? new Date(data.startDate) : null;
        if (data.endDate !== undefined)
            updateData.endDate = data.endDate ? new Date(data.endDate) : null;
        const harvest = await this.prisma.harvest.update({ where: { id }, data: updateData });
        return {
            id: harvest.id,
            name: harvest.name,
            salePricePerSack: Number(harvest.salePricePerSack),
            startDate: harvest.startDate ? harvest.startDate.toISOString() : null,
            endDate: harvest.endDate ? harvest.endDate.toISOString() : null,
        };
    }
    async remove(userId, id) {
        const existing = await this.prisma.harvest.findFirst({ where: { id, userId } });
        if (!existing)
            throw new common_1.NotFoundException('Harvest not found');
        await this.prisma.harvest.delete({ where: { id } });
        return { success: true };
    }
    async getLatestHarvest(userId) {
        return this.prisma.harvest.findFirst({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.HarvestsService = HarvestsService;
exports.HarvestsService = HarvestsService = HarvestsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], HarvestsService);
//# sourceMappingURL=harvests.service.js.map