import { IsString, IsOptional, IsNumber } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsNumber()
  stage?: number;
}
