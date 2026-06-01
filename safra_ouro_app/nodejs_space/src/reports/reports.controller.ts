import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportsService } from './reports.service';

@ApiTags('Reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('expenses')
  @ApiOperation({ summary: 'Expense report' })
  @ApiQuery({ name: 'harvestId', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  getExpenseReport(
    @Request() req: any,
    @Query('harvestId') harvestId?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.reportsService.getExpenseReport(req.user.userId, { harvestId, startDate, endDate });
  }

  @Get('workers')
  @ApiOperation({ summary: 'Worker payment report' })
  @ApiQuery({ name: 'harvestId', required: false })
  getWorkerReport(@Request() req: any, @Query('harvestId') harvestId?: string) {
    return this.reportsService.getWorkerReport(req.user.userId, harvestId);
  }

  @Get('production')
  @ApiOperation({ summary: 'Production report' })
  @ApiQuery({ name: 'harvestId', required: false })
  getProductionReport(@Request() req: any, @Query('harvestId') harvestId?: string) {
    return this.reportsService.getProductionReport(req.user.userId, harvestId);
  }

  @Get('profit')
  @ApiOperation({ summary: 'Profit report' })
  @ApiQuery({ name: 'harvestId', required: false })
  getProfitReport(@Request() req: any, @Query('harvestId') harvestId?: string) {
    return this.reportsService.getProfitReport(req.user.userId, harvestId);
  }
}
