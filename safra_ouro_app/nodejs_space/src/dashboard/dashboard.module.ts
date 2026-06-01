import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { HarvestsModule } from '../harvests/harvests.module';

@Module({
  imports: [HarvestsModule],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
