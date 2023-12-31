import { Module } from '@nestjs/common';
import { LiveRoomModule } from '../live-room/live-room.module';
import { LiveSocketModule } from '../live-socket/live-socket.module';
import { LiveModule } from '../live/live.module';
import { SrsController } from './srs.controller';
import { SrsService } from './srs.service';

@Module({
  controllers: [SrsController],
  providers: [SrsService],
  imports: [LiveRoomModule, LiveModule, LiveSocketModule],
})
export class SrsModule {}
