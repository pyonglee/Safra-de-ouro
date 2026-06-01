import { IsNumber, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateSettingsDto {
  @ApiProperty({ example: 40.0, description: 'Default price per balaio in R$' })
  @IsNumber()
  @Min(0)
  pricePerBalaio!: number;
}
