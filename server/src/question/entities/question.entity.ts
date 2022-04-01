import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';
import { TopicTag } from 'src/common/types';

export type QuestionDocument = Question & Document;
export enum Difficulty {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard',
}

@Schema()
export class Question {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ unique: true, required: true })
  questionId: string;

  @Prop()
  title?: string;

  @Prop()
  translatedTitle?: string;

  @Prop()
  titleSlug?: string;

  @Prop()
  topicTags?: TopicTag[];

  @Prop({ required: true })
  difficulty: Difficulty;

  @Prop()
  content?: string;

  @Prop()
  translatedContent?: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
