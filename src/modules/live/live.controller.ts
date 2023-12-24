import { JwtGuard } from './../auth/guard/jwt.guard';
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { LiveService } from './live.service';

@ApiTags('User Live')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('live')
export class LiveController {
  constructor(private liveService: LiveService) {}

  @ApiOperation({
    summary: 'Get list user in live room',
  })
  @Get(':liveRoomId/userList')
  getList(@Param('liveRoomId') roomId: string) {
    const result = this.liveService.getList(roomId);
    return result;
  }

  @ApiOperation({
    summary: 'Check if you in room',
  })
  @Get(':liveRoomId/user')
  async userInRoom(
    @GetUser() user: User,
    @Param('liveRoomId') liveRoomId: string,
  ) {
    const result = await this.liveService.findUserInRoom(user, liveRoomId);
    return result;
  }
}
