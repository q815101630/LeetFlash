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
import { Session } from '@nestjs/common';

const options = {
  cors: {
    origin: ['http://localhost:3000'],
    credentials: true,
  },
};

/**
 * ChatGateway is a WebSocketGateway that handles all chat messages.
 */
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
}
