import { Module } from '@nestjs/common';
import { BalaioRecordsController } from './balaio-records.controller';
import { BalaioRecordsService } from './balaio-records.service';
import { SettingsModule } from '../settings/settings.module';

@Module({
  imports: [SettingsModule],
  controllers: [BalaioRecordsController],
  providers: [BalaioRecordsService],
})
export class BalaioRecordsModule {}
