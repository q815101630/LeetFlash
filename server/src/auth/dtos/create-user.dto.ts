import {
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsOptional,
  IsString,
} from 'class-validator';
import { Source } from 'src/user/entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(30)
  email: string;

  @MaxLength(30)
  password?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  total_stages?: number[];

  @IsOptional()
  source?: Source;
}
