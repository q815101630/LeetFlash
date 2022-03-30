import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import { CardDto } from './dto/card.dto';
import { Card, CardDocument } from './entities/card.entity';

@Injectable()
export class CardService {
  constructor(@InjectModel(Card.name) private cardModel: Model<CardDocument>) {}

  async create(owner: User, question: Question): Promise<Card> {
    const initDay = parseInt(owner.total_stages.split(',')[0]);
    const today = new Date();
    const nextDay = new Date(today.setDate(today.getDate() + initDay));

    const card = new this.cardModel({
      owner,
      question,
      next_rep_date: nextDay,
      total_stages: owner.total_stages,
      max_stage: owner.total_stages.split(',').length,
    });
    return await card.save();
  }

  async findAll(user: User | string): Promise<Card[]> {
    return await this.cardModel
      .find({ owner: user })
      .populate('question')
      .exec();
  }

  async findByQuestionAndUser(question: Question, user: User): Promise<Card> {
    const card = await this.cardModel.findOne({ question, owner: user }).exec();
    return card;
  }

  /**
   * Fill in the empty card.question.translated_title/title card.question.translated_text/text
   * translated_url, url
   * @param cards - cards to process
   * @returns cards
   */
  serializeCards(cards: CardDto[] | Card[]): CardDto[] {
    const LC_CN_PREFIX = 'https://leetcode-cn.com/problems/';
    const LC_EN_PREFIX = 'https://leetcode.com/problems/';

    return cards.map((card) => {
      if (!card.question.translated_text)
        card.question.translated_text = card.question.text;
      if (!card.question.text)
        card.question.text = card.question.translated_text;
      if (!card.question.translated_title)
        card.question.translated_title = card.question.title;
      if (!card.question.title)
        card.question.title = card.question.translated_title;

      const original_url = card.question.url;
      card.question.url = LC_EN_PREFIX + original_url;
      card.question.translated_url = LC_CN_PREFIX + original_url;

      return card;
    });
  }
}
