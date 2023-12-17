import { Module } from '@nestjs/common';
import { LiveRoomModule } from '../live-room/live-room.module';
import { LiveService } from '../live/live.service';
import { SrsController } from './srs.controller';
import { SrsService } from './srs.service';

@Module({
  controllers: [SrsController],
  providers: [SrsService, LiveService],
  exports: [SrsService],
  imports: [LiveRoomModule],
})
export class SrsModule {}
