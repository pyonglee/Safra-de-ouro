import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductionRecordsService } from './production-records.service';
import { CreateProductionRecordDto } from './production-records.dto';

@ApiTags('Production Records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/production-records')
export class ProductionRecordsController {
  constructor(private readonly service: ProductionRecordsService) {}

  @Get()
  @ApiOperation({ summary: 'List production records' })
  @ApiQuery({ name: 'harvestId', required: false })
  findAll(@Request() req: any, @Query('harvestId') harvestId?: string) {
    return this.service.findAll(req.user.userId, harvestId);
  }

  @Post()
  @ApiOperation({ summary: 'Create production record' })
  create(@Request() req: any, @Body() dto: CreateProductionRecordDto) {
    return this.service.create(req.user.userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete production record' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.service.remove(req.user.userId, id);
  }
}
