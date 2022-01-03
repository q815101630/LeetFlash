import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class User {
  // _id will be automatically generated
  // @Prop()
  // _id: Types.ObjectId;

  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  description?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
