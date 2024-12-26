import { IsNotEmpty, IsString } from "class-validator";

export class UpdateCategory {
  @IsString()
  @IsNotEmpty()
  name: string
}