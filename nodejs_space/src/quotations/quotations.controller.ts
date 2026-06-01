import { Controller, Get, Post, Delete, Body, Param, Query, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { QuotationsService } from './quotations.service';
import { CreateQuotationDto } from './quotations.dto';

@ApiTags('Quotations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('api/quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  @Get()
  @ApiOperation({ summary: 'List quotations' })
  @ApiQuery({ name: 'coffeeType', required: false })
  findAll(@Request() req: any, @Query('coffeeType') coffeeType?: string) {
    return this.quotationsService.findAll(req.user.userId, coffeeType);
  }

  @Post()
  @ApiOperation({ summary: 'Create quotation' })
  create(@Request() req: any, @Body() dto: CreateQuotationDto) {
    return this.quotationsService.create(req.user.userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete quotation' })
  remove(@Request() req: any, @Param('id') id: string) {
    return this.quotationsService.remove(req.user.userId, id);
  }
}
