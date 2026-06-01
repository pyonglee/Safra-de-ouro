import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BalaioRecordsService } from './balaio-records.service';
import { CreateBalaioRecordDto } from './balaio-records.dto';

@ApiTags('Balaio Records')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/balaio-records')
export class BalaioRecordsController {
  constructor(private readonly balaioRecordsService: BalaioRecordsService) {}

  @Get()
  @ApiOperation({ summary: 'List balaio records' })
  @ApiQuery({ name: 'workerId', required: false })
  @ApiQuery({ name: 'harvestId', required: false })
  @ApiQuery({ name: 'date', required: false, description: 'YYYY-MM-DD' })
  findAll(
    @Request() req: any,
    @Query('workerId') workerId?: string,
    @Query('harvestId') harvestId?: string,
    @Query('date') date?: string,
  ) {
    return this.balaioRecordsService.findAll(req.user.userId, { workerId, harvestId, date });
  }

  @Post()
  @ApiOperation({ summary: 'Create a balaio record' })
  create(@Request() req: any, @Body() dto: CreateBalaioRecordDto) {
    return this.balaioRecordsService.create(req.user.userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a balaio record' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.balaioRecordsService.remove(req.user.userId, id);
  }
}
