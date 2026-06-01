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
var SettingsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let SettingsService = SettingsService_1 = class SettingsService {
    prisma;
    logger = new common_1.Logger(SettingsService_1.name);
    constructor(prisma) {
        this.prisma = prisma;
    }
    async get(userId) {
        let setting = await this.prisma.setting.findUnique({ where: { userId } });
        if (!setting) {
            setting = await this.prisma.setting.create({
                data: { userId, pricePerBalaio: 40.0 },
            });
        }
        return { pricePerBalaio: Number(setting.pricePerBalaio) };
    }
    async update(userId, pricePerBalaio) {
        const setting = await this.prisma.setting.upsert({
            where: { userId },
            update: { pricePerBalaio },
            create: { userId, pricePerBalaio },
        });
        this.logger.log(`Settings updated for user ${userId}`);
        return { pricePerBalaio: Number(setting.pricePerBalaio) };
    }
    async getPricePerBalaio(userId) {
        const s = await this.get(userId);
        return s.pricePerBalaio;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = SettingsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map