import { Controller, Get, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { DashboardService } from './dashboard.service';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Get dashboard data' })
  @ApiQuery({ name: 'harvestId', required: false, description: 'Filter by harvest (defaults to latest)' })
  getDashboard(@Request() req: any, @Query('harvestId') harvestId?: string) {
    return this.dashboardService.getDashboard(req.user.userId, harvestId);
  }
}
