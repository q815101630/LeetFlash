import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { Question } from 'src/question/entities/question.entity';
import { QuestionService } from '../../question/question.service';

export const enum RoleType {
  ADMIN = 'admin',
  USER = 'user',
  MODERATOR = 'moderator',
}

export const enum Source {
  GOOGLE = 'google',
  WEB = 'web',
  GITHUB = 'github',
}

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  password?: string;

  @Prop()
  description?: string;

  @Prop()
  total_stages: number[];

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Question.name }],
  })
  @Type(() => Question)
  questions: Question;

  @Prop({
    default: RoleType.USER,
    enum: [RoleType.ADMIN, RoleType.USER, RoleType.MODERATOR],
  })
  role: string;

  @Prop({ required: true, enum: [Source.GOOGLE, Source.WEB, Source.GITHUB] })
  source: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
