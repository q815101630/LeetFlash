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
  translatedTitle: string;
  @Expose()
  url: string;
}

export class CardDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => QuestionExposeDto)
  question: QuestionExposeDto;

  @Expose()
  next_rep_date: string;

  @Expose()
  stage: number;

  @Expose()
  is_archived: boolean;

  @Expose()
  last_rep_date: string;

  @Expose()
  created_at: string;

  @Expose()
  url: string;
}
