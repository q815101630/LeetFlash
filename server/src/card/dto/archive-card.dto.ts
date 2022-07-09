import { IsString } from 'class-validator';

export class ArchiveCardDto {
  @IsString()
  cardId: string;
}
