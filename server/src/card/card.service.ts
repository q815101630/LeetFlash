import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
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
    });
    return await card.save();
  }

  async findAll(user: User): Promise<Card[]> {
    return await this.cardModel
      .find({ owner: user })
      .populate('question')
      .exec();
  }

  async findByQuestionAndUser(
    question: Question,
    user: User,
  ): Promise<Card> {
    const card = await this.cardModel
      .findOne({ question, owner: user })
      .exec();
    return card;
  }
}
