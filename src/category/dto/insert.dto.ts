import { IsString } from "class-validator";

export class InsertCategoryDto {
  @IsString()
  name: string
}