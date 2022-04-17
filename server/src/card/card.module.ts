import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Card, CardSchema } from './entities/card.entity';
import { CardGateway } from './card.gateway';
import { QuestionModule } from 'src/question/question.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Card.name, schema: CardSchema }]),
    QuestionModule,
  ],
  controllers: [CardController],
  providers: [CardService, CardGateway],
  exports: [CardService, CardGateway],
})
export class CardModule {}
