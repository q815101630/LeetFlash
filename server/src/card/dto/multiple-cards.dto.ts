import { IsString } from 'class-validator';

export class MultipleCardsDto {
  @IsString({ each: true })
  ids: string[];
}
