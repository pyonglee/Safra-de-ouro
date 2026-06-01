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
var DashboardService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const harvests_service_1 = require("../harvests/harvests.service");
let DashboardService = DashboardService_1 = class DashboardService {
    prisma;
    harvestsService;
    logger = new common_1.Logger(DashboardService_1.name);
    constructor(prisma, harvestsService) {
        this.prisma = prisma;
        this.harvestsService = harvestsService;
    }
    async getDashboard(userId, harvestId) {
        const allHarvests = await this.prisma.harvest.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
            select: { id: true, name: true },
        });
        let currentHarvest = null;
        if (harvestId) {
            const h = allHarvests.find((h) => h.id === harvestId);
            if (h)
                currentHarvest = h;
        }
        if (!currentHarvest && allHarvests.length > 0) {
            currentHarvest = allHarvests[0];
        }
        if (!currentHarvest) {
            return {
                currentHarvest: null,
                harvests: [],
                totalSacks: 0,
                totalRevenue: 0,
                totalExpenses: 0,
                totalWorkerPayments: 0,
                grandTotalCosts: 0,
                netProfit: 0,
                profitMargin: 0,
                recentActivity: [],
            };
        }
        const hId = currentHarvest.id;
        const harvest = await this.prisma.harvest.findUnique({ where: { id: hId } });
        const salePricePerSack = harvest ? Number(harvest.salePricePerSack) : 0;
        const prodAgg = await this.prisma.production_record.aggregate({
            where: { userId, harvestId: hId },
            _sum: { sacks: true },
        });
        const totalSacks = prodAgg._sum.sacks || 0;
        const totalRevenue = totalSacks * salePricePerSack;
        const expenseAgg = await this.prisma.expense.aggregate({
            where: { userId, harvestId: hId },
            _sum: { cost: true },
        });
        const totalExpenses = Number(expenseAgg._sum.cost || 0);
        const balaioAgg = await this.prisma.balaio_record.aggregate({
            where: { userId, harvestId: hId },
            _sum: { totalValue: true },
        });
        const totalWorkerPayments = Number(balaioAgg._sum.totalValue || 0);
        const grandTotalCosts = totalExpenses + totalWorkerPayments;
        const netProfit = totalRevenue - grandTotalCosts;
        const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;
        const recentBalaios = await this.prisma.balaio_record.findMany({
            where: { userId, harvestId: hId },
            orderBy: { createdAt: 'desc' },
            take: 5,
            include: { worker: { select: { name: true } } },
        });
        const recentExpenses = await this.prisma.expense.findMany({
            where: { userId, harvestId: hId },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        const recentProduction = await this.prisma.production_record.findMany({
            where: { userId, harvestId: hId },
            orderBy: { createdAt: 'desc' },
            take: 5,
        });
        const recentActivity = [
            ...recentBalaios.map((b) => ({
                type: 'balaio',
                description: `${b.worker.name}: ${b.quantity} balaios`,
                date: b.createdAt.toISOString(),
                value: Number(b.totalValue),
            })),
            ...recentExpenses.map((e) => ({
                type: 'expense',
                description: `${e.productName} (${e.category})`,
                date: e.createdAt.toISOString(),
                value: Number(e.cost),
            })),
            ...recentProduction.map((p) => ({
                type: 'production',
                description: `${p.sacks} sacas produzidas`,
                date: p.createdAt.toISOString(),
                value: p.sacks,
            })),
        ]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10);
        return {
            currentHarvest,
            harvests: allHarvests,
            totalSacks,
            totalRevenue,
            totalExpenses,
            totalWorkerPayments,
            grandTotalCosts,
            netProfit,
            profitMargin: Math.round(profitMargin * 100) / 100,
            recentActivity,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = DashboardService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        harvests_service_1.HarvestsService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map