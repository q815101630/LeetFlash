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
  Delete,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ObjectId } from 'mongoose';
import { LocalAuthGuard } from 'src/guards/auth.guard';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CardService } from './card.service';
import { ArchiveCardDto } from './dto/archive-card.dto';
import { CardDto } from './dto/card.dto';
import { MultipleCardsDto } from './dto/multiple-cards.dto';
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

  @Post('/delete-many')
  @Serialize(CardDto)
  @UseGuards(LocalAuthGuard)
  async deleteCardsById(@Req() req, @Body() deleteCardsDto: MultipleCardsDto) {
    const cards = await this.cardService.findAll(req.user);
    const idsToDelete = cards
      .filter((card) => deleteCardsDto.ids.includes(card._id.toString()))
      .map((card) => card._id);

    await this.cardService.deleteMany(idsToDelete);
    return this.getCards(req);
  }

  @Post('/archive-many')
  @Serialize(CardDto)
  async archiveMany(@Req() req, @Body() ids: MultipleCardsDto) {
    const cards = await this.cardService.findAll(req.user);
    const idsToArchive = cards
      .filter((card) => ids.ids.includes(card._id.toString()))
      .map((card) => card._id);

    await this.cardService.archiveMany(idsToArchive);
    return this.getCards(req);
  }

  @Post('/activate-many')
  @Serialize(CardDto)
  async activateMany(@Req() req, @Body() ids: MultipleCardsDto) {
    const cards = await this.cardService.findAll(req.user);
    const idsToActivate = cards
      .filter((card) => ids.ids.includes(card._id.toString()))
      .map((card) => card._id);

    await this.cardService.activateMany(idsToActivate);
    return this.getCards(req);
  }

  @Post('/reset-many')
  @Serialize(CardDto)
  async resetMany(@Req() req, @Body() ids: MultipleCardsDto) {
    const cards = await this.cardService.findAll(req.user);
    const idsToReset = cards
      .filter((card) => ids.ids.includes(card._id.toString()))
      .map((card) => card._id);

    await this.cardService.resetMany(req.user, idsToReset);
    return this.getCards(req);
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
