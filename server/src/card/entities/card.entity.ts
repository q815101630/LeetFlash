import { Question } from './../../question/entities/question.entity';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import * as mongoose from 'mongoose';
import { User } from 'src/user/entities/user.entity';
import { Document, ObjectId } from 'mongoose';

export type CardDocument = Document & Card;

@Schema()
export class Card {
  @Transform(({ value }) => value.toString())
  _id: ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: User.name })
  @Type(() => User)
  owner: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: Question.name })
  @Type(() => Question)
  question: Question;

  @Prop({ default: Date.now })
  created_at?: Date;

  @Prop()
  note?: string;

  @Prop()
  code?: string;

  @Prop()
  lang?: string;

  @Prop()
  rawMemory?: number;

  @Prop()
  runtime?: number;

  @Prop({ default: false })
  is_archived?: boolean;

  @Prop({ default: 1 })
  stage: number;

  @Prop()
  total_stages: number[];

  @Prop({ default: Date.now })
  last_rep_date?: Date;

  @Prop({ required: true })
  next_rep_date: Date;

  @Prop({ default: 1 })
  frequency: number;
}

export const CardSchema = SchemaFactory.createForClass(Card);
