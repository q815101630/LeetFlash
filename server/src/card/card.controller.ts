import { Controller, Get, Req } from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CardService } from './card.service';
import { CardDto } from './dto/card.dto';

@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get('/')
  @Serialize(CardDto)
  async getCards(@Req() req) {
    const cards = await this.cardService.findAll(req.user);
    const retCards = this.cardService.serializeCards(cards);
    return retCards;
  }
}
