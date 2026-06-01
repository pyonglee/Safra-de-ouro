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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductionRecordsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const production_records_service_1 = require("./production-records.service");
const production_records_dto_1 = require("./production-records.dto");
let ProductionRecordsController = class ProductionRecordsController {
    service;
    constructor(service) {
        this.service = service;
    }
    findAll(req, harvestId) {
        return this.service.findAll(req.user.userId, harvestId);
    }
    create(req, dto) {
        return this.service.create(req.user.userId, dto);
    }
    remove(req, id) {
        return this.service.remove(req.user.userId, id);
    }
};
exports.ProductionRecordsController = ProductionRecordsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List production records' }),
    (0, swagger_1.ApiQuery)({ name: 'harvestId', required: false }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('harvestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductionRecordsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create production record' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, production_records_dto_1.CreateProductionRecordDto]),
    __metadata("design:returntype", void 0)
], ProductionRecordsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete production record' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ProductionRecordsController.prototype, "remove", null);
exports.ProductionRecordsController = ProductionRecordsController = __decorate([
    (0, swagger_1.ApiTags)('Production Records'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/production-records'),
    __metadata("design:paramtypes", [production_records_service_1.ProductionRecordsService])
], ProductionRecordsController);
//# sourceMappingURL=production-records.controller.js.map