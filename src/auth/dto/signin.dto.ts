import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class signinDTO {

  @IsString()
  @IsNotEmpty()
  identifiant: string

  @IsString()
  @IsNotEmpty()
  password: string;
}
