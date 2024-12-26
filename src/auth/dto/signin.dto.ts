import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class signinDTO {

  @IsString()
  @IsNotEmpty()
  userName: string
  
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
