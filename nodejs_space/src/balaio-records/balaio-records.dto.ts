import { IsNotEmpty, IsString, IsInt, IsUUID, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBalaioRecordDto {
  @ApiProperty({ description: 'Worker ID' })
  @IsUUID()
  workerId!: string;

  @ApiProperty({ description: 'Harvest ID' })
  @IsUUID()
  harvestId!: string;

  @ApiProperty({ example: '2025-06-15T00:00:00.000Z' })
  @IsString()
  @IsNotEmpty()
  date!: string;

  @ApiProperty({ example: 5, description: 'Number of balaios' })
  @IsInt()
  @Min(1)
  quantity!: number;
}
