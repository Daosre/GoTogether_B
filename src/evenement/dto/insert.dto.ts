import { IsString } from "class-validator";

export class InsertEventDto {
  @IsString()
  name: string
}