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
var BalaioRecordsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BalaioRecordsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const settings_service_1 = require("../settings/settings.service");
let BalaioRecordsService = BalaioRecordsService_1 = class BalaioRecordsService {
    prisma;
    settingsService;
    logger = new common_1.Logger(BalaioRecordsService_1.name);
    constructor(prisma, settingsService) {
        this.prisma = prisma;
        this.settingsService = settingsService;
    }
    async findAll(userId, filters) {
        const where = { userId };
        if (filters.workerId)
            where.workerId = filters.workerId;
        if (filters.harvestId)
            where.harvestId = filters.harvestId;
        if (filters.date) {
            const d = new Date(filters.date);
            const nextDay = new Date(d);
            nextDay.setDate(nextDay.getDate() + 1);
            where.date = { gte: d, lt: nextDay };
        }
        const records = await this.prisma.balaio_record.findMany({
            where,
            orderBy: { date: 'desc' },
            include: { worker: { select: { name: true } } },
        });
        const items = records.map((r) => ({
            id: r.id,
            workerId: r.workerId,
            workerName: r.worker.name,
            harvestId: r.harvestId,
            date: r.date.toISOString(),
            quantity: r.quantity,
            pricePerBalaio: Number(r.pricePerBalaio),
            totalValue: Number(r.totalValue),
            createdAt: r.createdAt.toISOString(),
        }));
        return { items };
    }
    async create(userId, data) {
        const worker = await this.prisma.worker.findFirst({ where: { id: data.workerId, userId } });
        if (!worker)
            throw new common_1.NotFoundException('Worker not found');
        const harvest = await this.prisma.harvest.findFirst({ where: { id: data.harvestId, userId } });
        if (!harvest)
            throw new common_1.NotFoundException('Harvest not found');
        const pricePerBalaio = await this.settingsService.getPricePerBalaio(userId);
        const totalValue = data.quantity * pricePerBalaio;
        const record = await this.prisma.balaio_record.create({
            data: {
                userId,
                workerId: data.workerId,
                harvestId: data.harvestId,
                date: new Date(data.date),
                quantity: data.quantity,
                pricePerBalaio,
                totalValue,
            },
            include: { worker: { select: { name: true } } },
        });
        this.logger.log(`Balaio record created: ${data.quantity} balaios for worker ${worker.name}`);
        return {
            id: record.id,
            workerId: record.workerId,
            workerName: record.worker.name,
            harvestId: record.harvestId,
            date: record.date.toISOString(),
            quantity: record.quantity,
            pricePerBalaio: Number(record.pricePerBalaio),
            totalValue: Number(record.totalValue),
            createdAt: record.createdAt.toISOString(),
        };
    }
    async remove(userId, id) {
        const record = await this.prisma.balaio_record.findFirst({ where: { id, userId } });
        if (!record)
            throw new common_1.NotFoundException('Balaio record not found');
        await this.prisma.balaio_record.delete({ where: { id } });
        return { success: true };
    }
};
exports.BalaioRecordsService = BalaioRecordsService;
exports.BalaioRecordsService = BalaioRecordsService = BalaioRecordsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        settings_service_1.SettingsService])
], BalaioRecordsService);
//# sourceMappingURL=balaio-records.service.js.map