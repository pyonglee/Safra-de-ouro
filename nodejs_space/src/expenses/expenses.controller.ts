import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ExpensesService } from './expenses.service';
import { CreateExpenseDto, UpdateExpenseDto } from './expenses.dto';

@ApiTags('Expenses')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/expenses')
export class ExpensesController {
  constructor(private readonly expensesService: ExpensesService) {}

  @Get()
  @ApiOperation({ summary: 'List expenses' })
  @ApiQuery({ name: 'harvestId', required: false })
  @ApiQuery({ name: 'category', required: false, enum: ['FERTILIZER', 'SPRAYING', 'OTHER'] })
  findAll(
    @Request() req: any,
    @Query('harvestId') harvestId?: string,
    @Query('category') category?: string,
  ) {
    return this.expensesService.findAll(req.user.userId, { harvestId, category });
  }

  @Post()
  @ApiOperation({ summary: 'Create expense' })
  create(@Request() req: any, @Body() dto: CreateExpenseDto) {
    return this.expensesService.create(req.user.userId, dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get expense details' })
  findOne(@Request() req: any, @Param('id') id: string) {
    return this.expensesService.findOne(req.user.userId, id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update expense' })
  update(@Request() req: any, @Param('id') id: string, @Body() dto: UpdateExpenseDto) {
    return this.expensesService.update(req.user.userId, id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete expense' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.expensesService.remove(req.user.userId, id);
  }
}
