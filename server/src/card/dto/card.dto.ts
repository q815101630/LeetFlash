import { Expose, Transform, Type } from 'class-transformer';
import { isArray, IsArray } from 'class-validator';
import { TopicTag } from 'src/common/types';
import { Question } from '../../question/entities/question.entity';

class QuestionExposeDto {
  @Expose()
  questionId: string;
  @Expose()
  title: string;
  @Expose()
  translatedTitle: string;
  @Expose()
  difficulty: string;

  @Expose()
  @Transform(({ obj }) => `https://leetcode.com/problems/${obj.titleSlug}/`)
  url: string;

  @Expose()
  @Transform(({ obj }) => `https://leetcode-cn.com/problems/${obj.titleSlug}/`)
  translatedUrl: string;

  @Expose()
  @Type(() => TopicTag)
  topicTags: TopicTag[];

  @Expose()
  content: string;

  @Expose()
  translatedContent: string;
}

export class CardDto {
  @Expose()
  @Type(() => QuestionExposeDto)
  question: QuestionExposeDto;

  @Expose()
  next_rep_date: Date;

  @Expose()
  stage: number;

  @Expose()
  total_stages: number[];

  @Expose()
  is_archived: boolean;

  @Expose()
  last_rep_date: Date;

  @Expose()
  created_at: Date;

  @Expose()
  id: string;

  @Expose()
  note: string;

  @Expose()
  code: string;

  @Expose()
  lang: string;

  @Expose()
  rawMemory: number;

  @Expose()
  runtime: number;
}
