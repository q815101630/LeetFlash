import {
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(30)
  email: string;

  @IsNotEmpty()
  @MaxLength(30)
  password: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  @IsString()
  total_stages?: string;
}
