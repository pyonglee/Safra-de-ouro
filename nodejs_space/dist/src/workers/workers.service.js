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
var WorkersService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let WorkersService = WorkersService_1 = class WorkersService {
    prisma;
    logger = new common_1.Logger(WorkersService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(userId, harvestId) {
        const workers = await this.prisma.worker.findMany({
            where: { userId },
            orderBy: { name: 'asc' },
            include: {
                balaioRecords: harvestId ? { where: { harvestId } } : true,
            },
        });
        const items = workers.map((w) => {
            const records = w.balaioRecords;
            const totalBalaios = records.reduce((sum, r) => sum + r.quantity, 0);
            const totalEarned = records.reduce((sum, r) => sum + Number(r.totalValue), 0);
            const lastRecord = records.length > 0
                ? records.sort((a, b) => b.date.getTime() - a.date.getTime())[0]
                : null;
            return {
                id: w.id,
                name: w.name,
                totalBalaios,
                totalEarned,
                lastRecordDate: lastRecord ? lastRecord.date.toISOString() : null,
                createdAt: w.createdAt.toISOString(),
            };
        });
        return { items };
    }
    async findOne(userId, id, harvestId) {
        const worker = await this.prisma.worker.findFirst({
            where: { id, userId },
            include: {
                balaioRecords: harvestId ? { where: { harvestId } } : true,
            },
        });
        if (!worker)
            throw new common_1.NotFoundException('Worker not found');
        const records = worker.balaioRecords;
        const totalBalaios = records.reduce((sum, r) => sum + r.quantity, 0);
        const totalEarned = records.reduce((sum, r) => sum + Number(r.totalValue), 0);
        const uniqueDays = new Set(records.map((r) => r.date.toISOString().split('T')[0])).size;
        const avgBalaiosPerDay = uniqueDays > 0 ? totalBalaios / uniqueDays : 0;
        return {
            id: worker.id,
            name: worker.name,
            totalBalaios,
            totalEarned,
            avgBalaiosPerDay: Math.round(avgBalaiosPerDay * 100) / 100,
            createdAt: worker.createdAt.toISOString(),
        };
    }
    async create(userId, name) {
        const worker = await this.prisma.worker.create({
            data: { userId, name },
        });
        this.logger.log(`Worker created: ${worker.name} for user ${userId}`);
        return { id: worker.id, name: worker.name, createdAt: worker.createdAt.toISOString() };
    }
    async update(userId, id, name) {
        const worker = await this.prisma.worker.findFirst({ where: { id, userId } });
        if (!worker)
            throw new common_1.NotFoundException('Worker not found');
        const updated = await this.prisma.worker.update({ where: { id }, data: { name } });
        return { id: updated.id, name: updated.name };
    }
    async remove(userId, id) {
        const worker = await this.prisma.worker.findFirst({ where: { id, userId } });
        if (!worker)
            throw new common_1.NotFoundException('Worker not found');
        await this.prisma.worker.delete({ where: { id } });
        return { success: true };
    }
};
exports.WorkersService = WorkersService;
exports.WorkersService = WorkersService = WorkersService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkersService);
//# sourceMappingURL=workers.service.js.map