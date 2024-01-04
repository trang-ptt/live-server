import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { LiveSocketController } from './live-socket.controller';
import { LiveSocketGateway } from './live-socket.gateway';

@Module({
  controllers: [LiveSocketController],
  providers: [LiveSocketGateway],
  exports: [LiveSocketGateway],
  imports: [AuthModule],
})
export class LiveSocketModule {}
