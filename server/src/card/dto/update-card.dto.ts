import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsBoolean,
} from 'class-validator';

export class UpdateCardDto {
  @IsString()
  @IsOptional()
  note?: string;

  @IsString()
  @IsOptional()
  code?: string;

  @IsBoolean()
  @IsOptional()
  is_archived?: boolean;

  @IsNumber()
  @IsOptional()
  stage?: number;

  @IsString()
  @IsOptional()
  next_rep_date?: string | Date;

  @IsString()
  @IsOptional()
  last_rep_date?: string | Date;
}
