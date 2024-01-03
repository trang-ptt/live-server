import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { SRS_CONFIG } from 'src/config/secret';
import { getIpAddress } from 'src/utils';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { myaxios } from './../../utils/request';
import { GetStreamQuery, SrsClientDTO, SrsRTCBodyDTO } from './dto';
import { SrsService } from './srs.service';

@ApiTags('SRS')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('srs')
export class SrsController {
  constructor(private srsService: SrsService) {}

  // @Post('rtcV1Publish')
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

  // @Post('rtcV1Play')
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

  @ApiOperation({
    summary: 'Get clients info',
  })
  @Get('apiV1Clients')
  async getApiV1Clients(@Query() query: GetStreamQuery) {
    const { start, count } = query;
    const res = await this.srsService.common.getApiV1Clients({ start, count });
    return res;
  }

  @ApiOperation({
    summary: 'Publish live room',
  })
  @Post('onPublish')
  async onPublish(@GetUser() user: User, @Body() dto: SrsClientDTO) {
    try {
      return await this.srsService.onPublish(user, dto);
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Unpublish live room',
  })
  @Post('onUnpublish')
  async onUnpublish(
    @GetUser() user: User,
    @Query('liveRoomId') roomId: string,
  ) {
    try {
      const res = await this.srsService.onUnpublish(user, roomId);
      return res;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Join live room',
  })
  @Post('onPlay')
  async onPlay(@GetUser() user: User, @Body() dto: SrsClientDTO) {
    try {
      const res = await this.srsService.onPlay(user, dto);
      return res;
    } catch (error) {
      throw error;
    }
  }

  @ApiOperation({
    summary: 'Leave live room',
  })
  @Post('onStop')
  async onStop(@GetUser() user: User, @Query('liveRoomId') roomId: string) {
    try {
      const res = await this.srsService.onStop(user, roomId);
      return res;
    } catch (error) {
      throw error;
    }
  }
}
