import { IsString, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Difficulty } from '../entities/question.entity';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsString()
  question_id: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  translated_text?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  translated_title?: string;

  //TODO: only wants /problems/two-sum/ like this
  @IsNotEmpty()
  @IsString()
  url: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;
}
