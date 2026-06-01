import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateHarvestDto {
  @ApiProperty({ example: 'Safra 2025' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 1500.0, description: 'Sale price per sack in R$' })
  @IsNumber()
  @Min(0)
  salePricePerSack!: number;

  @ApiPropertyOptional({ example: '2025-04-01T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-09-30T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  endDate?: string;
}

export class UpdateHarvestDto {
  @ApiPropertyOptional({ example: 'Safra 2025' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ example: 1500.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  salePricePerSack?: number;

  @ApiPropertyOptional({ example: '2025-04-01T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiPropertyOptional({ example: '2025-09-30T00:00:00.000Z' })
  @IsOptional()
  @IsString()
  endDate?: string;
}
