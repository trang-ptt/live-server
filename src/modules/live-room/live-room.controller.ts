import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { CreateLiveRoomDTO } from './dto/live-room.dto';
import { LiveRoomService } from './live-room.service';

@ApiTags('Live Room')
@Controller('live_room')
export class LiveRoomController {
  constructor(private liveRoomService: LiveRoomService) {}

  @Get('list')
  getList() {
    const result = this.liveRoomService.getList();
    return result;
  }

  @Get('find/:id')
  find(@Param('id') id: string) {
    const result = this.liveRoomService.find(id);
    return result;
  }

  @Get('find/:userId')
  findByUserId(@Param('userId') id: string) {
    const result = this.liveRoomService.findByUserId(id);
    return result;
  }

  @Post('create')
  create(@GetUser() user: User, @Body() dto: CreateLiveRoomDTO) {
    const result = this.liveRoomService.create(user, dto.name);
    return result;
  }
}
