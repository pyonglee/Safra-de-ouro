import { Module } from '@nestjs/common';
import { ProductionRecordsController } from './production-records.controller';
import { ProductionRecordsService } from './production-records.service';

@Module({
  controllers: [ProductionRecordsController],
  providers: [ProductionRecordsService],
})
export class ProductionRecordsModule {}
