import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Question } from 'src/question/entities/question.entity';
import { User } from 'src/user/entities/user.entity';
import { CardDto } from './dto/card.dto';
import { UpdateCardDto } from './dto/update-card.dto';
import { Card, CardDocument } from './entities/card.entity';
import { Socket } from 'socket.io';
import { parse } from 'cookie';
import jwt_decode from 'jwt-decode';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class CardService {
  userIdToSocketIdMap: Map<string, string> = new Map();

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
    await card.save();
    return card;
  }

  async findAll(user: User | string): Promise<Card[]> {
    return await this.cardModel
      .find({ owner: user })
      .populate('question')
      .exec();
  }

  async updateById(
    id: ObjectId | string,
    updateCardDto: UpdateCardDto,
  ): Promise<Card> {
    return await this.cardModel
      .findOneAndUpdate(
        { _id: id },
        { ...updateCardDto },
        {
          new: true,
        },
      )
      .populate('question')
      .exec();
  }

  async findOne(id: ObjectId | string, user: User | string): Promise<Card> {
    return await this.cardModel
      .findOne({ _id: id, owner: user })
      .populate('question')
      .exec();
  }

  async findByQuestionAndUser(question: Question, user: User): Promise<Card> {
    const card = await this.cardModel
      .findOne({ question, owner: user })
      .populate('question')
      .exec();
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

  serializeCard(card: any): CardDto {
    const LC_CN_PREFIX = 'https://leetcode-cn.com/problems/';
    const LC_EN_PREFIX = 'https://leetcode.com/problems/';

    if (!card.question.translated_text)
      card.question.translated_text = card.question.text;
    if (!card.question.text) card.question.text = card.question.translated_text;
    if (!card.question.translated_title)
      card.question.translated_title = card.question.title;
    if (!card.question.title)
      card.question.title = card.question.translated_title;

    const original_url = card.question.url;
    card.question.url = LC_EN_PREFIX + original_url;
    card.question.translated_url = LC_CN_PREFIX + original_url;

    return card;
  }

  getSocketId(userId: string) {
    return this.userIdToSocketIdMap.get(userId);
  }

  removeSocketId(userId: string) {
    return this.userIdToSocketIdMap.delete(userId);
  }

  setSocketId(userId: string, socketId: string) {
    return this.userIdToSocketIdMap.set(userId, socketId);
  }

  /**
   * A function to retrieve the user from the socket.
   * @param socket Socket.io socket instance
   * @returns user object
   */
  async getUserFromSocket(socket: Socket) {
    const cookie = socket.handshake.headers.cookie;
    const parsed = parse(cookie);
    const { session, Authentication } = parsed;
    const sig = parsed['session.sig'];
    const headerInfo = Authentication.split('.')[0];
    const token = `${headerInfo}.${session.slice(
      0,
      session.length - 2,
    )}.${sig}`;
    const { user }: { user: User } = jwt_decode(token);
    if (!user || !user._id) {
      throw new WsException('Invalid credentials.');
    }

    return user;
  }
}
