import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { LiveModule } from './modules/live/live.module';
import { PrismaModule } from './prisma/prisma.module';
import { SrsModule } from './modules/srs/srs.module';
import { LiveRoomModule } from './modules/live-room/live-room.module';

@Module({
  imports: [
    LiveModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    SrsModule,
    LiveRoomModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
