import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { WorkersService } from './workers.service';
import { CreateWorkerDto, UpdateWorkerDto } from './workers.dto';

@ApiTags('Workers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/workers')
export class WorkersController {
  constructor(private readonly workersService: WorkersService) {}

  @Get()
  @ApiOperation({ summary: 'List all workers' })
  @ApiQuery({ name: 'harvestId', required: false })
  findAll(@Request() req: any, @Query('harvestId') harvestId?: string) {
    return this.workersService.findAll(req.user.userId, harvestId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a worker' })
  create(@Request() req: any, @Body() dto: CreateWorkerDto) {
    return this.workersService.create(req.user.userId, dto.name);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get worker details' })
  @ApiQuery({ name: 'harvestId', required: false })
  findOne(@Request() req: any, @Param('id') id: string, @Query('harvestId') harvestId?: string) {
    return this.workersService.findOne(req.user.userId, id, harvestId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update worker' })
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateWorkerDto) {
    return this.workersService.update(req.user.userId, id, dto.name);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete worker' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.workersService.remove(req.user.userId, id);
  }
}
