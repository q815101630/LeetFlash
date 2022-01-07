import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Transform, Type } from 'class-transformer';
import { ObjectId } from 'mongoose';
import * as mongoose from 'mongoose';
import { Question } from 'src/question/entities/question.entity';
import { QuestionService } from '../../question/question.service';

@Schema()
export class User {
  @Transform(({ value }) => value.toString())
  _id: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  description?: string;

  @Prop()
  total_stages: string;

  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: Question.name }],
  })
  @Type(() => Question)
  questions: Question;
}

export const UserSchema = SchemaFactory.createForClass(User);
