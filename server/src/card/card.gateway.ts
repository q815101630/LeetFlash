import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { CardService } from './card.service';
import { Server, Socket } from 'socket.io';
import {
  forwardRef,
  HttpStatus,
  Inject,
  Injectable,
  Session,
} from '@nestjs/common';
import { Card } from './entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import { Question } from 'src/question/entities/question.entity';
import { SubmitQuestionDto } from 'src/question/dto/submit-question.dto';
import { Response } from 'express';
import { CardInfo } from '../common/types';
const options = {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
};

/**
 * ChatGateway is a WebSocketGateway that handles all chat messages.
 */
@Injectable()
@WebSocketGateway(options)
export class CardGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly cardService: CardService) {}

  /**
   * Hook: called when a client connects to the gateway.
   * Add user to the connected userId-socketId map
   */
  async handleConnection(socket: Socket) {
    try {
      const user = await this.cardService.getUserFromSocket(socket);
      if (!user) {
        throw new WsException('User not found');
      }
      this.cardService.setSocketId(user._id, socket.id);
      console.log(`user: ${user.email} is connected to socket.io`);
    } catch (error) {
      socket.emit('error', 'Failed authentication');
      socket.disconnect();
    }
  }

  /**
   * Hook: called when a client disconnects to the gateway.
   * Remove user from the connected userId-socketId map
   */
  async handleDisconnect(socket: Socket) {
    try {
      const user = await this.cardService.getUserFromSocket(socket);
      if (!user) {
        throw new WsException('User not found');
      }
      this.cardService.removeSocketId(user._id);
      console.log(`user: ${user.email} disconnect socket.io`);
    } catch (error) {
      socket.emit('error', error);
      socket.disconnect();
    }
  }

  async handleSubmit(
    res: Response,
    user: User,
    submitQuestionDto: SubmitQuestionDto,
    question: Question,
  ) {
    let card = await this.cardService.findByQuestionIdAndUser(
      question.questionId,
      user,
    );
    if (!card) {
      card = await this.cardService.create(user, submitQuestionDto, question);

      // if it is a new card:
      const socketId = this.cardService.getSocketId(card.owner._id.toString());
      const success = this.server.to(socketId).emit('new-card', card);
      console.log(`new-card: ${success}`);
      return { status: HttpStatus.CREATED, info: CardInfo.NEW, card };
    }

    // if the card is already archived:
    if (card.is_archived) {
      return { status: HttpStatus.OK, info: CardInfo.ARCHIVED, card };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    // if it is an existing card:
    card = this.cardService.computeUpdateCardInfo(card, submitQuestionDto);

    // check if the last repetition is today, only update if it is not today
    const last_rep_date = card.last_rep_date;
    last_rep_date.setHours(0, 0, 0, 0);
    if (last_rep_date.getTime() !== today.getTime()) {
      // Automatically update this question if it is not archived:
      card.last_rep_date = new Date();
      card.next_rep_date = new Date(
        new Date().getTime() +
          card.total_stages[
            Math.min(card.stage, card.total_stages.length - 1)
          ] *
            86400000,
      );
      card.stage = Math.min(card.stage + 1, card.total_stages.length);
      card.is_archived = card.stage >= card.total_stages.length;
      card = await this.cardService.update(card);
    }

    const socketId = this.cardService.getSocketId(card.owner._id.toString());
    if (!socketId)
      return { status: HttpStatus.OK, info: CardInfo.REVIEW, card };

    const activeCards = await this.cardService.findActiveCards(user);

    // check if current card is an active card due today
    if (
      !!activeCards.find(
        (currCard) =>
          currCard.next_rep_date.getTime() <= today.getTime() &&
          card._id.toString() === currCard._id.toString(),
      )
    ) {
      // review card
      const success = this.server.to(socketId).emit('review-today', card);
      console.log(`review-today: ${success}`);
    } else {
      // this card is due future, ask if confirm early review
      const success = this.server.to(socketId).emit('early-review', card);
      console.log(`early-review: ${success}`);
    }

    return { status: HttpStatus.OK, card, info: CardInfo.REVIEW };
  }
}
