import { IsNotEmpty } from 'class-validator';
export class ResetPasswordDto {
  @IsNotEmpty()
  email: string;
}
