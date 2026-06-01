import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { HarvestsService } from './harvests.service';
import { CreateHarvestDto, UpdateHarvestDto } from './harvests.dto';

@ApiTags('Harvests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/harvests')
export class HarvestsController {
  constructor(private readonly harvestsService: HarvestsService) {}

  @Get()
  @ApiOperation({ summary: 'List all harvests' })
  findAll(@Request() req: any) {
    return this.harvestsService.findAll(req.user.userId);
  }

  @Post()
  @ApiOperation({ summary: 'Create a harvest' })
  create(@Request() req: any, @Body() dto: CreateHarvestDto) {
    return this.harvestsService.create(req.user.userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get harvest details with financials' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.harvestsService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update harvest' })
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateHarvestDto) {
    return this.harvestsService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete harvest' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.harvestsService.remove(req.user.userId, id);
  }
}
