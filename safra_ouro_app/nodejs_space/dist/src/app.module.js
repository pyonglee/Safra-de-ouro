"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const settings_module_1 = require("./settings/settings.module");
const workers_module_1 = require("./workers/workers.module");
const harvests_module_1 = require("./harvests/harvests.module");
const balaio_records_module_1 = require("./balaio-records/balaio-records.module");
const production_records_module_1 = require("./production-records/production-records.module");
const expenses_module_1 = require("./expenses/expenses.module");
const quotations_module_1 = require("./quotations/quotations.module");
const dashboard_module_1 = require("./dashboard/dashboard.module");
const reports_module_1 = require("./reports/reports.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            settings_module_1.SettingsModule,
            workers_module_1.WorkersModule,
            harvests_module_1.HarvestsModule,
            balaio_records_module_1.BalaioRecordsModule,
            production_records_module_1.ProductionRecordsModule,
            expenses_module_1.ExpensesModule,
            quotations_module_1.QuotationsModule,
            dashboard_module_1.DashboardModule,
            reports_module_1.ReportsModule,
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map