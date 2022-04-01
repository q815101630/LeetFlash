import { Expose, Type } from 'class-transformer';
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

  titleSlug: string;

  @Expose()
  get url(): string {
    return `https://leetcode.com/problems/${this.titleSlug}/`;
  }

  @Expose()
  get translatedUrl(): string {
    return `https://leetcode-cn.com/problems/${this.titleSlug}/`;
  }
  @Expose()
  @IsArray()
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
  max_stage: number;

  @Expose()
  is_archived: boolean;

  @Expose()
  last_rep_date: Date;

  @Expose()
  created_at: Date;

  @Expose()
  id: string;

  titleSlug: string;

  @Expose()
  note: string;

  @Expose()
  code: string;

  @Expose()
  lang: string;

  @Expose()
  get avgMemory(): string {
    return `https://leetcode-cn.com/problems/${this.titleSlug}/`;
  }

  @Expose()
  runtime: string;
}
