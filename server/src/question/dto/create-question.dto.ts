import { Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { TopicTag } from 'src/common/types';
import { Difficulty } from '../entities/question.entity';

export class CreateQuestionDto {
  @IsNotEmpty()
  @IsString()
  questionId: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  translatedContent?: string;

  @IsString()
  titleSlug: string;

  @IsString()
  title: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TopicTag)
  topicTags: TopicTag[];

  @IsOptional()
  @IsString()
  translatedTitle?: string;

  @IsEnum(Difficulty)
  difficulty: Difficulty;
}
