import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SrsService } from '../srs/srs.service';

@Injectable()
export class LiveService {
  constructor(private prisma: PrismaService, private srsService: SrsService) {}

  async getList() {
    const result = await this.prisma.live.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        trackVideo: true,
        trackAudio: true,
        srsServerId: true,
        srsServiceId: true,
        srsAction: true,
        srsIp: true,
        srsVhost: true,
        srsApp: true,
        srsTcUrl: true,
        srsStream: true,
        srsParam: true,
        srsStreamUrl: true,
        srsStreamId: true,
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

  async closeLive(user: User) {
    const room = await this.findByUserId(user.id);
    if (!room) throw new BadRequestException('No live room found');
    const live = await this.findByRoomId(room.id);
    live.forEach((item) => {
      this.srsService.common.deleteApiV1Clients(item.srsClientId);
    });
    await this.deleteLiveByRoomId(room.id);
    return {
      code: 'SUCCESS',
    };
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

  async isLive(user: User) {
    const room = await this.findByUserId(user.id);
    if (!room) throw new BadRequestException('No live room found');
    const live = await this.findByRoomId(room.id);
    return live
  }
}
