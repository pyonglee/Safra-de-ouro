import { IsNotEmpty, IsString, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductionRecordDto {
  @ApiProperty({ description: 'Harvest ID' })
  @IsUUID()
  harvestId!: string;

  @ApiProperty({ example: '2025-07-01T00:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  date!: string;

  @ApiProperty({ example: 10, description: 'Number of sacks' })
  @IsInt()
  @Min(1)
  sacks!: number;

  @ApiPropertyOptional({ example: 'Lote A - café arábica' })
  @IsOptional()
  @IsString()
  notes?: string;
}
