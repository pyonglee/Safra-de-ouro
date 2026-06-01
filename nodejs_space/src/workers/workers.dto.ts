import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateWorkerDto {
  @ApiProperty({ example: 'Carlos Silva' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}

export class UpdateWorkerDto {
  @ApiProperty({ example: 'Carlos Silva' })
  @IsString()
  @IsNotEmpty()
  name!: string;
}
