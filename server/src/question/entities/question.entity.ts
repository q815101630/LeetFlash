import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import { Document, ObjectId } from 'mongoose';

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
  id: string;

  @Prop({ unique: true, required: true })
  question_id: string;

  @Prop({ required: true })
  difficulty: Difficulty;

  @Prop()
  text?: string;

  @Prop()
  translatedText?: string;

  @Prop()
  title?: string;

  @Prop()
  translatedTitle?: string;

  //TODO: only wants /problems/two-sum/ like this
  @Prop()
  url: string;
}

export const QuestionSchema = SchemaFactory.createForClass(Question);
