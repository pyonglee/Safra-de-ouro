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
var ProductionRecordsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionRecordsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let ProductionRecordsService = ProductionRecordsService_1 = class ProductionRecordsService {
    prisma;
    logger = new common_1.Logger(ProductionRecordsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, harvestId) {
        const where = { userId };
        if (harvestId)
            where.harvestId = harvestId;
        const records = await this.prisma.production_record.findMany({
            where,
            orderBy: { date: 'desc' },
        });
        return {
            items: records.map((r) => ({
                id: r.id,
                harvestId: r.harvestId,
                date: r.date.toISOString(),
                sacks: r.sacks,
                notes: r.notes,
                createdAt: r.createdAt.toISOString(),
            })),
        };
    }
    async create(userId, data) {
        const harvest = await this.prisma.harvest.findFirst({ where: { id: data.harvestId, userId } });
        if (!harvest)
            throw new common_1.NotFoundException('Harvest not found');
        const record = await this.prisma.production_record.create({
            data: {
                userId,
                harvestId: data.harvestId,
                date: new Date(data.date),
                sacks: data.sacks,
                notes: data.notes || null,
            },
        });
        this.logger.log(`Production record created: ${data.sacks} sacks`);
        return {
            id: record.id,
            harvestId: record.harvestId,
            date: record.date.toISOString(),
            sacks: record.sacks,
            notes: record.notes,
            createdAt: record.createdAt.toISOString(),
        };
    }
    async remove(userId, id) {
        const record = await this.prisma.production_record.findFirst({ where: { id, userId } });
        if (!record)
            throw new common_1.NotFoundException('Production record not found');
        await this.prisma.production_record.delete({ where: { id } });
        return { success: true };
    }
};
exports.ProductionRecordsService = ProductionRecordsService;
exports.ProductionRecordsService = ProductionRecordsService = ProductionRecordsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductionRecordsService);
//# sourceMappingURL=production-records.service.js.map