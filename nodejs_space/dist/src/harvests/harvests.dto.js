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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateHarvestDto = exports.CreateHarvestDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateHarvestDto {
    name;
    salePricePerSack;
    startDate;
    endDate;
}
exports.CreateHarvestDto = CreateHarvestDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Safra 2025' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateHarvestDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 1500.0, description: 'Sale price per sack in R$' }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateHarvestDto.prototype, "salePricePerSack", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-04-01T00:00:00.000Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHarvestDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-09-30T00:00:00.000Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateHarvestDto.prototype, "endDate", void 0);
class UpdateHarvestDto {
    name;
    salePricePerSack;
    startDate;
    endDate;
}
exports.UpdateHarvestDto = UpdateHarvestDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Safra 2025' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHarvestDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1500.0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateHarvestDto.prototype, "salePricePerSack", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-04-01T00:00:00.000Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHarvestDto.prototype, "startDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: '2025-09-30T00:00:00.000Z' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateHarvestDto.prototype, "endDate", void 0);
//# sourceMappingURL=harvests.dto.js.map