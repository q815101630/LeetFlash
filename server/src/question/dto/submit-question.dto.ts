import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { CreateQuestionDto } from './create-question.dto';

export class SubmitQuestionDto {
  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  lang: string;

  @IsString()
  @IsOptional()
  rawMemory: string;

  @IsObject()
  @Type(() => CreateQuestionDto)
  question: CreateQuestionDto;

  @IsString()
  runtime: string;

  @IsString()
  sourceUrl: string;

  @IsNumber()
  timestamp: number;
}
