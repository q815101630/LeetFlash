import { IsString } from 'class-validator';

export class AddNoteDto {
  @IsString()
  note: string;

  @IsString()
  questionId: string;
}
