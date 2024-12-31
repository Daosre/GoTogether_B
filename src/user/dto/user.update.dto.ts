import {
  IsBoolean,
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
} from 'class-validator';

export class updateUserDTO {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  userName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  lastName: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(30)
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;
  @IsString()
  @IsNotEmpty()
  @MaxLength(320)
  @IsEmail()
  email: string;

  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}
