import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateCategory {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  @MaxLength(50)
  name: string
}