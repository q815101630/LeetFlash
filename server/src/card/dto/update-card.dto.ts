import { IsString, IsOptional, IsNumber, IsDate } from 'class-validator';

export class UpdateCardDto {
  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsNumber()
  stage?: number;

  @IsOptional()
  @IsDate()
  next_rep_date?: Date;
}
