import { Module } from '@nestjs/common';
import { SrsModule } from '../srs/srs.module';
import { LiveController } from './live.controller';
import { LiveService } from './live.service';

@Module({
  controllers: [LiveController],
  providers: [LiveService],
  imports: [SrsModule],
  exports: [LiveService],
})
export class LiveModule {}
