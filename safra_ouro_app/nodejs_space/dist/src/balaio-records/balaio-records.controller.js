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
exports.BalaioRecordsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const balaio_records_service_1 = require("./balaio-records.service");
const balaio_records_dto_1 = require("./balaio-records.dto");
let BalaioRecordsController = class BalaioRecordsController {
    balaioRecordsService;
    constructor(balaioRecordsService) {
        this.balaioRecordsService = balaioRecordsService;
    }
    findAll(req, workerId, harvestId, date) {
        return this.balaioRecordsService.findAll(req.user.userId, { workerId, harvestId, date });
    }
    create(req, dto) {
        return this.balaioRecordsService.create(req.user.userId, dto);
    }
    remove(req, id) {
        return this.balaioRecordsService.remove(req.user.userId, id);
    }
};
exports.BalaioRecordsController = BalaioRecordsController;
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'List balaio records' }),
    (0, swagger_1.ApiQuery)({ name: 'workerId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'harvestId', required: false }),
    (0, swagger_1.ApiQuery)({ name: 'date', required: false, description: 'YYYY-MM-DD' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)('workerId')),
    __param(2, (0, common_1.Query)('harvestId')),
    __param(3, (0, common_1.Query)('date')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", void 0)
], BalaioRecordsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a balaio record' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, balaio_records_dto_1.CreateBalaioRecordDto]),
    __metadata("design:returntype", void 0)
], BalaioRecordsController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a balaio record' }),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], BalaioRecordsController.prototype, "remove", null);
exports.BalaioRecordsController = BalaioRecordsController = __decorate([
    (0, swagger_1.ApiTags)('Balaio Records'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Controller)('api/balaio-records'),
    __metadata("design:paramtypes", [balaio_records_service_1.BalaioRecordsService])
], BalaioRecordsController);
//# sourceMappingURL=balaio-records.controller.js.map