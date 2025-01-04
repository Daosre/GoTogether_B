import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class eventDto {
  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(50)
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  @MinLength(3)
  address: string;

  @ApiProperty({ description: 'Date ' })
  @IsString()
  @IsNotEmpty()
  time: string;

  @ApiProperty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsNotEmpty()
  @Min(0)
  @Max(9999)
  price: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(2)
  @Max(999)
  @IsInt()
  maxParticipants: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  categoryName: string;
}
