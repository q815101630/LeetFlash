import {
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsOptional,
  IsString,
} from 'class-validator';
import { Source } from '../entities/user.entity';

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
  total_stages?: string;

  @IsOptional()
  source?: Source;
}
