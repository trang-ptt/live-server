import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { JwtGuard } from '../auth/guard';
import { LiveRoomService } from './live-room.service';

@ApiTags('Live Room')
@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('live-room')
export class LiveRoomController {
  constructor(private liveRoomService: LiveRoomService) {}

  @ApiOperation({
    summary: 'Get list of live rooms',
  })
  @Get('list')
  getList() {
    const result = this.liveRoomService.getList();
    return result;
  }

  @ApiOperation({
    summary: 'Get live room by id',
  })
  @Get(':id')
  find(@Param('id') id: string) {
    const result = this.liveRoomService.find(id);
    return result;
  }

  @ApiOperation({
    summary: 'Get live room by userId',
  })
  @Get('find/:userId')
  findByUserId(@Param('userId') id: string) {
    const result = this.liveRoomService.findByUserId(id);
    return result;
  }

  @ApiOperation({
    summary: 'Create live room',
  })
  @Post('create')
  create(@GetUser() user: User) {
    const result = this.liveRoomService.create(user);
    return result;
  }

  @Get('find/:username')
  findByUsername(@Param('username') username: string) {
    const result = this.liveRoomService.findByUsername(username);
    return result;
  }
}
