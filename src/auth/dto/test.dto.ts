import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class InsertEventDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  city: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  adresse: string;

  @IsString()
  @IsNotEmpty()
  time: string;
}
