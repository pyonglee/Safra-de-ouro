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
var QuotationsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuotationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let QuotationsService = QuotationsService_1 = class QuotationsService {
    prisma;
    logger = new common_1.Logger(QuotationsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, coffeeType) {
        const where = { userId };
        if (coffeeType)
            where.coffeeType = coffeeType;
        const quotations = await this.prisma.quotation.findMany({
            where,
            orderBy: { date: 'desc' },
        });
        const items = quotations.map((q) => ({
            id: q.id,
            coffeeType: q.coffeeType,
            pricePerSack: Number(q.pricePerSack),
            date: q.date.toISOString(),
            source: q.source,
            createdAt: q.createdAt.toISOString(),
        }));
        const typeMap = {};
        for (const q of items) {
            if (!typeMap[q.coffeeType])
                typeMap[q.coffeeType] = [];
            typeMap[q.coffeeType].push(q);
        }
        const latestByType = {};
        for (const [type, list] of Object.entries(typeMap)) {
            const sorted = list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            const current = sorted[0];
            const previous = sorted.length > 1 ? sorted[1] : null;
            let trend = 'stable';
            if (previous) {
                if (current.pricePerSack > previous.pricePerSack)
                    trend = 'up';
                else if (current.pricePerSack < previous.pricePerSack)
                    trend = 'down';
            }
            latestByType[type] = {
                current: { pricePerSack: current.pricePerSack, date: current.date },
                previous: previous ? { pricePerSack: previous.pricePerSack, date: previous.date } : null,
                trend,
            };
        }
        return { items, latestByType };
    }
    async create(userId, data) {
        const quotation = await this.prisma.quotation.create({
            data: {
                userId,
                coffeeType: data.coffeeType,
                pricePerSack: data.pricePerSack,
                date: new Date(data.date),
                source: data.source || null,
            },
        });
        this.logger.log(`Quotation created: ${data.coffeeType} R$ ${data.pricePerSack}`);
        return {
            id: quotation.id,
            coffeeType: quotation.coffeeType,
            pricePerSack: Number(quotation.pricePerSack),
            date: quotation.date.toISOString(),
            source: quotation.source,
            createdAt: quotation.createdAt.toISOString(),
        };
    }
    async remove(userId, id) {
        const existing = await this.prisma.quotation.findFirst({ where: { id, userId } });
        if (!existing)
            throw new common_1.NotFoundException('Quotation not found');
        await this.prisma.quotation.delete({ where: { id } });
        return { success: true };
    }
};
exports.QuotationsService = QuotationsService;
exports.QuotationsService = QuotationsService = QuotationsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], QuotationsService);
//# sourceMappingURL=quotations.service.js.map