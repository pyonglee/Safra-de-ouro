import { IsNotEmpty, IsString, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateQuotationDto {
  @ApiProperty({ example: 'Arábica', description: 'Coffee type' })
  @IsString()
  @IsNotEmpty()
  coffeeType!: string;

  @ApiProperty({ example: 1450.0, description: 'Price per sack in R$' })
  @IsNumber()
  @Min(0)
  pricePerSack!: number;

  @ApiProperty({ example: '2025-06-15T00:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  date!: string;

  @ApiPropertyOptional({ example: 'Cepea/Esalq' })
  @IsOptional()
  @IsString()
  source?: string;
}
