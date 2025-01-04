import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class signinDTO {
  @ApiProperty({ description: 'Email or userName' })
  @IsString()
  @IsNotEmpty()
  identifiant: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
