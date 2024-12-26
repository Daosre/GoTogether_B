import { IsNotEmpty, IsNumber, IsString, IsUUID, MaxLength, MinLength } from 'class-validator';

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
  address: string;

  @IsString()
  @IsNotEmpty()
  time: string;

  @IsNumber()
  @IsNotEmpty()
  price: number

  @IsNumber()
  @IsNotEmpty()
  maxParticipants: number

  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  categoryName: string
}
