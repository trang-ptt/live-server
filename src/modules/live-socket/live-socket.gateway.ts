import { OnModuleInit, UnauthorizedException } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { User } from '@prisma/client';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from '../auth/auth.service';
import { LiveCommentDTO, LiveLikeDTO } from './dto';

@WebSocketGateway({
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001'],
  },
})
export class LiveSocketGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnModuleInit
{
  @WebSocketServer()
  server: Server;

  constructor(
    private prisma: PrismaService,
    private authService: AuthService,
  ) {}

  async handleConnection(client: any) {
    try {
      const decodedToken = await this.authService.verifyJwt(
        client.handshake.headers.authorization.split(' ')[1],
      );
      const user = await this.prisma.user.findUnique({
        where: {
          id: decodedToken.sub,
        },
      });
      delete user.password;

      if (!user) {
        return this.disconnect(client);
      } else {
        await this.prisma.user.update({
          where: {
            id: user.id,
          },
          data: {
            socketId: client.id,
          },
        }),
          (client.data.user = user);
      }

      client.emit('init', {
        message: 'Welcome to the live server!',
      });
    } catch (error) {
      console.log(error);
      return this.disconnect(client);
    }
  }

  private disconnect(client: Socket) {
    client.emit('Error', new UnauthorizedException());
    client.disconnect();
  }

  handleDisconnect(client: any) {
    client.disconnect();
  }

  onModuleInit() {
    this.server.on('connection', (socket) => {
      console.log(socket.id);
    });
  }

  @SubscribeMessage('comment')
  async handleComment(client: any, payload: LiveCommentDTO) {
    if (!client.data.user) await this.handleConnection(client);
    const user: User = await client.data.user;
    const { comment, roomId } = payload;

    this.server.emit('onComment', {
      roomId,
      userId: user.id,
      username: user.username,
      ava: user.ava,
      comment,
    });
  }

  @SubscribeMessage('like')
  async handleLike(client: any, payload: LiveLikeDTO) {
    if (!client.data.user) await this.handleConnection(client);
    const user: User = await client.data.user;
    const { react, roomId } = payload;

    this.server.emit('onReact', {
      roomId,
      userId: user.id,
      username: user.username,
      ava: user.ava,
      react,
    });
  }
}
