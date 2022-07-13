import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { SubmitQuestionDto } from 'src/question/dto/submit-question.dto';
import { QuestionService } from 'src/question/question.service';

@Injectable()
export class CardService {
  userIdToSocketIdMap: Map<string, string> = new Map();

  constructor(
    @InjectModel(Card.name) private cardModel: Model<CardDocument>,
    private questionService: QuestionService,
  ) {}

  async create(
    owner: User,
    submitQuestionDto: SubmitQuestionDto,
    question: Question,
  ): Promise<Card> {
    const today = new Date();
    const nextDay = new Date(
      today.setDate(today.getDate() + owner.total_stages[0]),
    );

    const card = new this.cardModel({
      owner,
      question,
      next_rep_date: nextDay,
      total_stages: owner.total_stages,

      code: submitQuestionDto.code,
      lang: submitQuestionDto.lang,
      rawMemory: parseInt(submitQuestionDto.rawMemory),
      runtime: parseInt(submitQuestionDto.runtime.split(' ')[0]),
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

  async update(card: Card): Promise<Card> {
    const { _id } = card;
    delete card._id;
    const existingCard = await this.cardModel
      .findByIdAndUpdate({ _id }, { ...card }, { new: true })
      .populate('question')
      .exec();
    if (!existingCard) {
      throw new NotFoundException(`Question #${_id} not found`);
    }
    return existingCard;
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

  async findByQuestionIdAndUser(questionId: string, user: User): Promise<Card> {
    const question = await this.questionService.findByQuestionId(questionId);

    const card = await this.cardModel
      .findOne({
        question,
        owner: user,
      })
      .populate('question')
      .exec();

    return card;
  }

  async findActiveCards(user: User): Promise<Card[]> {
    const cards = await this.cardModel
      .find({
        owner: user,
        is_archived: false,
      })
      .populate('question')
      .exec();
    return cards;
  }

  async deleteMany(ids: string[] | ObjectId[]) {
    return await this.cardModel.deleteMany({ _id: { $in: ids } });
  }

  async resetMany(owner: User, ids: string[] | ObjectId[]) {
    return await this.cardModel.updateMany(
      { _id: { $in: ids } },
      {
        next_rep_date: new Date(),
        is_archived: false,
        stage: 1,
        total_stages: owner.total_stages,
      },
    );
  }

  async activateMany(ids: string[] | ObjectId[]) {
    return await this.cardModel.updateMany(
      { _id: { $in: ids } },
      { is_archived: false },
    );
  }

  async archiveMany(ids: string[] | ObjectId[]) {
    return await this.cardModel.updateMany(
      { _id: { $in: ids } },
      { is_archived: true },
    );
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
    // eslint-disable-next-line prefer-const
    let { session, Authentication } = parsed;
    const sig = parsed['session.sig'];

    const headerInfo = !!Authentication
      ? Authentication.split('.')[0]
      : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9';

    while (session[session.length - 1] === '=') {
      session = session.slice(0, session.length - 1);
    }

    const token = `${headerInfo}.${session}.${sig}`;

    const { user }: { user: User } = jwt_decode(token);
    if (!user || !user._id) {
      throw new WsException('Invalid credentials.');
    }

    return user;
  }

  computeUpdateCardInfo(
    card: Card,
    submitQuestionDto: SubmitQuestionDto,
  ): Card {
    card.rawMemory =
      (card.frequency * card.rawMemory +
        parseInt(submitQuestionDto.rawMemory)) /
      (card.frequency + 1);

    card.runtime =
      (card.frequency * card.runtime +
        parseInt(submitQuestionDto.runtime.split(' ')[0])) /
      (card.frequency + 1);
    card.frequency++;
    return card;
  }
}
