import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class UserDto {
  @Expose()
  _id: string;

  @Expose()
  email: string;
}
