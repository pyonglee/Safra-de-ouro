import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { SettingsModule } from './settings/settings.module';
import { WorkersModule } from './workers/workers.module';
import { HarvestsModule } from './harvests/harvests.module';
import { BalaioRecordsModule } from './balaio-records/balaio-records.module';
import { ProductionRecordsModule } from './production-records/production-records.module';
import { ExpensesModule } from './expenses/expenses.module';
import { QuotationsModule } from './quotations/quotations.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    SettingsModule,
    WorkersModule,
    HarvestsModule,
    BalaioRecordsModule,
    ProductionRecordsModule,
    ExpensesModule,
    QuotationsModule,
    DashboardModule,
    ReportsModule,
  ],
})
export class AppModule {}
