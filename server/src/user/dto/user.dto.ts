import { Expose } from 'class-transformer';
import { ObjectId } from 'mongoose';

export class UserDto {
  @Expose()
  id: string;
  @Expose()
  email: string;
}
