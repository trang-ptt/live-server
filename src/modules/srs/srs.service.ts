import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { SRS_CONFIG } from 'src/config/secret';
import { LOCALHOST_URL } from 'src/constants';
import { PrismaService } from 'src/prisma/prisma.service';
import { myaxios } from 'src/utils/request';
import { LiveRoomService } from '../live-room/live-room.service';
import { LiveService } from '../live/live.service';
import { SrsClientDTO } from './dto';
import { IApiV1Clients, IApiV1Streams } from './interfaces';

@Injectable()
export class SrsService {
  constructor(
    private prisma: PrismaService,
    private liveRoomService: LiveRoomService,
    private liveService: LiveService,
  ) {}
  common = {
    getApiV1ClientDetail: (clientId: string) =>
      myaxios.get(
        `http://${LOCALHOST_URL}:${SRS_CONFIG.docker.port[1985]}/api/v1/clients/${clientId}`,
      ),
    getApiV1Clients: ({ start, count }: { start: number; count: number }) =>
      myaxios.get<IApiV1Clients>(
        `http://${LOCALHOST_URL}:${SRS_CONFIG.docker.port[1985]}/api/v1/clients?start=${start}&count=${count}`,
      ),
    getApiV1Streams: ({ start, count }: { start: number; count: number }) =>
      myaxios.get<IApiV1Streams>(
        `http://${LOCALHOST_URL}:${SRS_CONFIG.docker.port[1985]}/api/v1/streams?start=${start}&count=${count}`,
      ),
    deleteApiV1Clients: (clientId: string) =>
      myaxios.delete(
        `http://${LOCALHOST_URL}:${SRS_CONFIG.docker.port[1985]}/api/v1/clients/${clientId}`,
      ),
  };

  async onPublish(user: User, dto: SrsClientDTO) {
    const roomId = dto.liveRoomId;

    const isLive = await this.liveService.findPublishLiveByRoomId(roomId);
    if (isLive) {
      throw new ForbiddenException('Cannot publish, room is living');
    }

    const liveRoom = await this.liveRoomService.find(roomId);
    if (!liveRoom) throw new ForbiddenException('Room not exist');

    const [newLive, updateLiveRoom] = await Promise.all([
      this.prisma.live.create({
        data: {
          liveRoomId: roomId,
          userId: user.id,
          srsClientId: dto.clientId,
          publish: true,
          deletedAt: new Date(0),
        },
      }),
      this.prisma.liveRoom.update({
        where: {
          id: liveRoom.id,
        },
        data: {
          isShow: true,
        },
      }),
    ]);
    return {
      newLive,
      updateLiveRoom,
    };
  }

  async onUnpublish(user: User, roomId: string) {
    const liveRoom = await this.liveRoomService.find(roomId);
    if (!liveRoom) throw new ForbiddenException('Room not exist');

    const isLive = await this.liveService.findPublishLiveByRoomId(roomId);
    if (!isLive) {
      throw new ForbiddenException('Cannot unpublish, no live exist');
    }

    if (user.id !== isLive.userId)
      throw new ForbiddenException('Only host can unpublish');

    const liveUser = await this.liveService.findByRoomId(roomId);
    liveUser.forEach((item) => {
      this.common.deleteApiV1Clients(item.srsClientId);
    });

    await this.liveService.deleteLiveByRoomId(roomId);
    return {
      code: 'SUCCESS',
    };
  }

  async onPlay(user: User, dto: SrsClientDTO) {
    const roomId = dto.liveRoomId;

    const liveRoom = await this.liveRoomService.find(roomId);
    if (!liveRoom) throw new ForbiddenException('Room not exist');

    const newLive = await this.prisma.live.create({
      data: {
        liveRoomId: roomId,
        userId: user.id,
        srsClientId: dto.clientId,
        publish: true,
        deletedAt: new Date(0),
      },
    });
    return newLive;
  }

  async onStop(user: User, roomId: string) {
    const liveRoom = await this.liveRoomService.find(roomId);
    if (!liveRoom) throw new ForbiddenException('Room not exist');

    const live = await this.liveService.findUserInRoom(user, roomId);
    if (!live) throw new ForbiddenException('User not in room');

    await Promise.all([
      this.common.deleteApiV1Clients(live.srsClientId),
      this.prisma.live.delete({
        where: {
          id: live.id,
        },
      }),
    ]);

    return {
      code: 'SUCCESS',
    };
  }
}
