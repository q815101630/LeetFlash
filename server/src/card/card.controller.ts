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
    // HACK: This is a hack to get the user id from the session
    if (!req.user) {
      return await this.cardService.findAll('61f438534e170f7aa31da4e6' as any);
    }
    const cards = await this.cardService.findAll(req.user);
    return cards;
  }
}
