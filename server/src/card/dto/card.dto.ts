import { Expose, Type } from 'class-transformer';
import { Question } from '../../question/entities/question.entity';

class QuestionExposeDto {
  @Expose()
  question_id: string;
  @Expose()
  difficulty: string;
  @Expose()
  title: string;
  @Expose()
  translated_title: string;
  @Expose()
  text: string;
  @Expose()
  translated_text: string;
  @Expose()
  url: string;
  @Expose()
  translated_url: string;
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
}
