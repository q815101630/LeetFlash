import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { LocalAuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CardService } from './card.service';
import { CardDto } from './dto/card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@ApiTags('Card')
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

  @Get('/:id')
  @Serialize(CardDto)
  @UseGuards(LocalAuthGuard)
  async getCard(@Param('id') id: string, @Req() req) {
    const card = await this.cardService.findOne(id, req.user);
    if (!card || card === null) {
      throw new BadRequestException('Card not found');
    }
    const retCard = this.cardService.serializeCard(card);
    return retCard;
  }

  @Patch('/:id')
  @Serialize(CardDto)
  @UseGuards(LocalAuthGuard)
  async patchCard(
    @Param('id') id: ObjectId,
    @Req() req,
    @Body() updateCardDto: UpdateCardDto,
  ) {
    const card = await this.cardService.findOne(id, req.user);
    if (!card || card === null) {
      throw new Error('Card not found');
    }
    const updatedCard = await this.cardService.updateById(id, updateCardDto);
    const retCard = this.cardService.serializeCard(updatedCard);
    return retCard;
  }
}
