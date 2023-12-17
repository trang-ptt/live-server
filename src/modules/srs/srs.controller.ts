import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { SRS_CONFIG } from 'src/config/secret';
import { PrismaService } from 'src/prisma/prisma.service';
import { getIpAddress } from 'src/utils';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { LiveRoomService } from '../live-room/live-room.service';
import { myaxios } from './../../utils/request';
import { LiveService } from './../live/live.service';
import { GetStreamQuery, SrsCbDTO, SrsRTCBodyDTO } from './dto';
import { SrsService } from './srs.service';

@ApiTags('SRS')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('srs')
export class SrsController {
  constructor(
    private srsService: SrsService,
    private liveRoomService: LiveRoomService,
    private liveService: LiveService,
    private prisma: PrismaService,
  ) {}

  @Post('rtcV1Publish')
  async rtcV1Publish(@Body() rtcData: SrsRTCBodyDTO) {
    const { api, clientip, sdp, streamurl, tid } = rtcData;
    const ipAddresses = getIpAddress();
    const localhostUrl = ipAddresses.length > 0 ? ipAddresses[0] : 'localhost';

    try {
      const res = await myaxios.post(
        `http://${localhostUrl}:${SRS_CONFIG.docker.port[1985]}/rtc/v1/publish/`,
        { api, clientip, sdp, streamurl, tid },
      );

      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Post('rtcV1Play')
  async rtcV1Play(@Body() rtcData: SrsRTCBodyDTO) {
    const { api, clientip, sdp, streamurl, tid } = rtcData;
    const ipAddresses = getIpAddress();
    const localhostUrl = ipAddresses.length > 0 ? ipAddresses[0] : 'localhost';

    try {
      const res = await myaxios.post(
        `http://${localhostUrl}:${SRS_CONFIG.docker.port[1985]}/rtc/v1/play/`,
        { api, clientip, sdp, streamurl, tid },
      );

      return res;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  @Get('apiV1Streams')
  async getApiV1Streams(@Query() query: GetStreamQuery) {
    const { start, count } = query;
    const res = await this.srsService.common.getApiV1Streams({ start, count });
    return res;
  }

  @Get('apiV1Clients')
  async getApiV1Clients(@Query() query: GetStreamQuery) {
    const { start, count } = query;
    const res = await this.srsService.common.getApiV1Clients({ start, count });
    return res;
  }

  @Post('onPublish')
  async onPublish(@GetUser() user: User, @Body() dto: SrsCbDTO) {
    try {
      const roomId = dto.stream.replace(/\.(m3u8|flv)$/g, '');

      const isLive = await this.liveService.findByRoomId(roomId);
      if (isLive.length > 0) {
        throw new ForbiddenException('Cannot publish, room is living');
      }

      const liveRoom = await this.liveRoomService.find(roomId);
      if (!liveRoom) throw new ForbiddenException('Room not exist');

      const newLive = await this.prisma.live.create({
        data: {
          liveRoomId: roomId,
          userId: user.id,
          trackAudio: 1,
          trackVideo: 1,
          srsAction: dto.action,
          srsApp: dto.app,
          srsClientId: dto.clientId,
          srsIp: dto.ip,
          srsParam: dto.param,
          srsServerId: dto.serverId,
          srsStream: dto.stream,
          srsStreamId: dto.streamId,
          srsStreamUrl: dto.streamUrl,
          srsTcUrl: dto.tcUrl,
          srsVhost: dto.vhost,
          deletedAt: null,
        },
      });
      return newLive;
    } catch (error) {
      throw error;
    }
  }

  @Post('onUnpublish')
  async onUnpublish(@GetUser() user: User, @Body() dto: SrsCbDTO) {
    try {
      const roomId = dto.stream.replace(/\.(m3u8|flv)$/g, '');

      const isLive = await this.liveService.findByRoomId(roomId);
      if (isLive.length > 0) {
        throw new ForbiddenException('Cannot publish, room is living');
      }

      const liveRoom = await this.liveRoomService.find(roomId);
      if (!liveRoom) throw new ForbiddenException('Room not exist');

      await this.liveService.deleteLiveByRoomId(roomId);
      return {
        code: 'SUCCESS',
      };
    } catch (error) {
      throw error;
    }
  }
}
