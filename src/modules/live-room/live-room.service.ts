import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from '@prisma/client';
import { SERVER_LIVE } from 'src/config/secret';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LiveRoomService {
  constructor(private prisma: PrismaService) {}

  async getList() {
    const result = await this.prisma.liveRoom.findMany({
      where: {
        deletedAt: new Date(0),
        isShow: true,
      },
      select: {
        id: true,
        name: true,
        isShow: true,
        flvUrl: true,
        pushUrl: true,
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
        pushUrl: true,
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
        deletedAt: new Date(0),
        isShow: true,
      },
    });
    return result;
  }

  async create(user: User) {
    const existed = await this.findByUserId(user.id);
    if (existed) {
      if (!existed.isShow) {
        return {
          code: 'SUCCESS',
          message: 'Room existed',
          liveRoom: existed,
        };
      }
      const { id } = existed;

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

    const liveRoom = await this.prisma.liveRoom.create({
      data: {
        isShow: false,
        deletedAt: new Date(0),
        userId: user.id,
      },
    });

    const liveUrl = (live_room_id: string) => ({
      pushUrl: `${SERVER_LIVE.PushDomain}/live/${SERVER_LIVE.AppName}/${live_room_id}`,
      flvUrl: `${SERVER_LIVE.PullDomain}/live/${SERVER_LIVE.AppName}/${live_room_id}.flv`,
      hlsUrl: `${SERVER_LIVE.PullDomain}/live/${SERVER_LIVE.AppName}/${live_room_id}.m3u8`,
    });

    const { pushUrl, flvUrl, hlsUrl } = liveUrl(liveRoom.id);

    const updateLiveRoom = await this.prisma.liveRoom.update({
      where: {
        id: liveRoom.id,
      },
      data: {
        pushUrl,
        flvUrl,
        hlsUrl,
      },
    });
    return {
      code: 'SUCCESS',
      message: 'Room created',
      liveRoom: updateLiveRoom,
    };
  }

  async findByUsername(username: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        username,
      },
      select: {
        id: true,
        username: true,
        ava: true,
      },
    });
    if (!user) throw new NotFoundException('User not found');

    const live = await this.findByUserId(user.id);
    if (!live) throw new NotFoundException('Live not found');
    return {
      ...live,
      user,
    };
  }
}
