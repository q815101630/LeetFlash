import { Expose } from 'class-transformer';

export class UserDto {
  @Expose()
  _id: number;
  @Expose()
  email: string;
  @Expose()
  username: string;
}
