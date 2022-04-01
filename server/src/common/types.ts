import { IsOptional, IsString } from 'class-validator';

export class TopicTag {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  translatedName?: string;
}
