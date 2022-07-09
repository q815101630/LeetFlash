import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  Headers,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { LocalAuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CardService } from './card.service';
import { ArchiveCardDto } from './dto/archive-card.dto';
import { CardDto } from './dto/card.dto';
import { UpdateCardDto } from './dto/update-card.dto';

@ApiTags('Card')
@Controller('card')
export class CardController {
  constructor(private readonly cardService: CardService) {}

  @Get('/')
  @Serialize(CardDto)
  @UseGuards(LocalAuthGuard)
  async getCards(@Req() req) {
    const cards = await this.cardService.findAll(req.user);
    return cards;
  }

  @Get('/:id')
  @Serialize(CardDto)
  @UseGuards(LocalAuthGuard)
  async getCard(@Param('id') id: string, @Req() req) {
    const card = await this.cardService.findOne(id, req.user);
    if (!card || card === null) {
      throw new BadRequestException('Card not found');
    }
    return card;
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
    updateCardDto.next_rep_date = new Date(updateCardDto.next_rep_date);
    updateCardDto.last_rep_date = new Date(updateCardDto.last_rep_date);
    if (updateCardDto.stage >= card.total_stages.length) {
      updateCardDto.stage = card.total_stages.length;
      updateCardDto.is_archived = true;
    }
    const updatedCard = await this.cardService.updateById(id, updateCardDto);
    return updatedCard;
  }

  /**
   * A special method to archive card from extension
   * @param uuid user's uuid
   */
  @Post('/archive')
  @Serialize(CardDto)
  async archiveCard(
    @Headers('UUID') uuid: string,
    @Body() archiveCardDto: ArchiveCardDto,
  ) {
    const card = await this.cardService.findOne(archiveCardDto.cardId, uuid);

    if (!card || card === null) {
      throw new Error('Card not found');
    }
    card.is_archived = true;
    const updatedCard = await this.cardService.update(card);
    return updatedCard;
  }
}
