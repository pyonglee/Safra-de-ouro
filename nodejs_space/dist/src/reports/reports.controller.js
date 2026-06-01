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
exports.ReportsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const reports_service_1 = require("./reports.service");
let ReportsController = class ReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    getExpenseReport(req, harvestId, startDate, endDate) {
        return this.reportsService.getExpenseReport(req.user.userId, { harvestId, startDate, endDate });
    }
    getWorkerReport(req, harvestId) {
        return this.reportsService.getWorkerReport(req.user.userId, harvestId);
    }
    getProductionReport(req, harvestId) {
        return this.reportsService.getProductionReport(req.user.userId, harvestId);
    }
    getProfitReport(req, harvestId) {
        return this.reportsService.getProfitReport(req.user.userId, harvestId);
    }
};
exports.ReportsController = ReportsController;
__decorate([
    (0, common_1.Get)('expenses'),
    (0, swagger_1.ApiOperation)({ summary: 'Expense report' }),
    (0, swagger_1.ApiQuery)({ name: 'harvestId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'startDate', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'endDate', required: false }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('harvestId')),
    __param(2, (0, common_1.Query)('startDate')),
    __param(3, (0, common_1.Query)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getExpenseReport", null);
__decorate([
    (0, common_1.Get)('workers'),
    (0, swagger_1.ApiOperation)({ summary: 'Worker payment report' }),
    (0, swagger_1.ApiQuery)({ name: 'harvestId', required: false }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('harvestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getWorkerReport", null);
__decorate([
    (0, common_1.Get)('production'),
    (0, swagger_1.ApiOperation)({ summary: 'Production report' }),
    (0, swagger_1.ApiQuery)({ name: 'harvestId', required: false }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('harvestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getProductionReport", null);
__decorate([
    (0, common_1.Get)('profit'),
    (0, swagger_1.ApiOperation)({ summary: 'Profit report' }),
    (0, swagger_1.ApiQuery)({ name: 'harvestId', required: false }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('harvestId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], ReportsController.prototype, "getProfitReport", null);
exports.ReportsController = ReportsController = __decorate([
    (0, swagger_1.ApiTags)('Reports'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/reports'),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], ReportsController);
//# sourceMappingURL=reports.controller.js.map