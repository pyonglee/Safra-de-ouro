import { IsNotEmpty, IsString, IsNumber, IsOptional, IsIn, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateExpenseDto {
  @ApiProperty({ description: 'Harvest ID' })
  @IsUUID()
  harvestId!: string;

  @ApiProperty({ enum: ['FERTILIZER', 'SPRAYING', 'OTHER'] })
  @IsString()
  @IsIn(['FERTILIZER', 'SPRAYING', 'OTHER'])
  category!: string;

  @ApiProperty({ example: 'NPK 20-05-20' })
  @IsString()
  @IsNotEmpty()
  productName!: string;

  @ApiProperty({ example: '2025-06-01T00:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  date!: string;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({ example: 'kg' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: 10.5, description: 'Applied area in hectares' })
  @IsOptional()
  @IsNumber()
  appliedArea?: number;

  @ApiProperty({ example: 1500.0, description: 'Cost in R$' })
  @IsNumber()
  @Min(0)
  cost!: number;

  @ApiPropertyOptional({ example: 'Aplicado no talhão 3' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateExpenseDto {
  @ApiPropertyOptional({ enum: ['FERTILIZER', 'SPRAYING', 'OTHER'] })
  @IsOptional()
  @IsString()
  @IsIn(['FERTILIZER', 'SPRAYING', 'OTHER'])
  category?: string;

  @ApiPropertyOptional({ example: 'NPK 20-05-20' })
  @IsOptional()
  @IsString()
  productName?: string;

  @ApiPropertyOptional({ example: '2025-06-01T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @IsNumber()
  quantity?: number;

  @ApiPropertyOptional({ example: 'kg' })
  @IsOptional()
  @IsString()
  unit?: string;

  @ApiPropertyOptional({ example: 10.5 })
  @IsOptional()
  @IsNumber()
  appliedArea?: number;

  @ApiPropertyOptional({ example: 1500.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  cost?: number;

  @ApiPropertyOptional({ example: 'Aplicado no talhão 3' })
  @IsOptional()
  @IsString()
  notes?: string;
}
