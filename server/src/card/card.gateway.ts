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
import { forwardRef, Inject, Injectable, Session } from '@nestjs/common';
import { Card } from './entities/card.entity';
import { User } from 'src/user/entities/user.entity';
import { Question } from 'src/question/entities/question.entity';
import { SubmitQuestionDto } from 'src/question/dto/submit-question.dto';

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
      socket.emit('error', 'Failed authentication');
      socket.disconnect();
    }
  }

  async handleSubmit(
    user: User,
    submitQuestionDto: SubmitQuestionDto,
    question: Question,
  ) {
    let card = await this.cardService.findByQuestionAndUser(question, user);
    if (!card) {
      card = await this.cardService.create(user, submitQuestionDto, question);
    } else {
      card = this.cardService.computeUpdateCardInfo(card, submitQuestionDto);
      card = await this.cardService.update(card);
    }

    const socketId = this.cardService.getSocketId(card.owner._id.toString());
    if (socketId) {
      const gg = this.server.to(socketId).emit('new-submit-today', card);
      console.log(`socket success: ${gg}`);
    }

    return card;
  }
}
