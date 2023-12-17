import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SERVER_LIVE } from 'src/config/secret';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LiveRoomService {
  constructor(private prisma: PrismaService) {}

  async getList() {
    const result = await this.prisma.liveRoom.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        id: true,
        name: true,
        isShow: true,
        flvUrl: true,
        rmtpUrl: true,
        hlsUrl: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            ava: true,
          },
        },
      },
    });
    return result;
  }

  async find(id: string) {
    const result = await this.prisma.liveRoom.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        isShow: true,
        flvUrl: true,
        rmtpUrl: true,
        hlsUrl: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
            ava: true,
          },
        },
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

  async create(user: User, name: string) {
    const existed = await this.findByUserId(user.id);
    if (existed) throw new ForbiddenException('Live room existed');

    const liveRoom = await this.prisma.liveRoom.create({
      data: {
        name,
        deletedAt: null,
        userId: user.id,
      },
    });

    const liveUrl = (live_room_id: string) => ({
      rmtpUrl: `${SERVER_LIVE.PushDomain}/live/${SERVER_LIVE.AppName}/${live_room_id}`,
      flvUrl: `${SERVER_LIVE.PullDomain}/live/${SERVER_LIVE.AppName}/${live_room_id}.flv`,
      hlsUrl: `${SERVER_LIVE.PullDomain}/live/${SERVER_LIVE.AppName}/${live_room_id}.m3u8`,
    });

    const { rmtpUrl, flvUrl, hlsUrl } = liveUrl(liveRoom.id);

    const updateLiveRoom = await this.prisma.liveRoom.update({
      where: {
        id: liveRoom.id,
      },
      data: {
        rmtpUrl,
        flvUrl,
        hlsUrl,
      },
    });
    return updateLiveRoom
  }
}
