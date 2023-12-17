import { Module } from '@nestjs/common';
import { LiveRoomController } from './live-room.controller';
import { LiveRoomService } from './live-room.service';

@Module({
  controllers: [LiveRoomController],
  providers: [LiveRoomService],
  exports: [LiveRoomService],
})
export class LiveRoomModule {}
