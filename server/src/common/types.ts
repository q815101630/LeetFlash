import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

export class TopicTag {
  @IsString()
  @Expose()
  name: string;

  @IsString()
  @Expose()
  @IsOptional()
  translatedName?: string;
}
