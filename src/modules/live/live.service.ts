import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LiveService {
  constructor(private prisma: PrismaService) {}

  async getList(roomId: string) {
    const result = await this.prisma.live.findMany({
      where: {
        deletedAt: null,
        liveRoomId: roomId,
      },
      select: {
        srsClientId: true,
        publish: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            ava: true,
          },
        },
        liveRoomId: true,
      },
    });
    return result;
  }

  async findByUserId(userId: string) {
    const result = await this.prisma.liveRoom.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
    });
    return result;
  }

  async findByRoomId(id: string) {
    const result = await this.prisma.live.findMany({
      where: {
        liveRoomId: id,
      },
    });
    return result;
  }

  async findPublishLiveByRoomId(id: string) {
    const result = await this.prisma.live.findFirst({
      where: {
        liveRoomId: id,
        publish: true,
      },
    });
    return result;
  }

  async deleteLiveByRoomId(id: string) {
    await Promise.all([
      this.prisma.live.deleteMany({
        where: {
          liveRoomId: id,
        },
      }),
      this.prisma.liveRoom.delete({
        where: {
          id,
        },
      }),
    ]);
  }

  async findUserInRoom(user: User, roomId: string) {
    const room = await this.prisma.liveRoom.findUnique({
      where: {
        id: roomId,
      },
    });
    if (!room) throw new BadRequestException('No live room found');
    const live = await this.prisma.live.findFirst({
      where: {
        liveRoomId: roomId,
        userId: user.id,
      },
    });
    return live;
  }
}
