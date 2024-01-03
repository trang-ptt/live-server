import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { LiveModule } from './modules/live/live.module';
import { PrismaModule } from './prisma/prisma.module';
import { SrsModule } from './modules/srs/srs.module';
import { LiveRoomModule } from './modules/live-room/live-room.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    PrismaModule,
    SrsModule,
    LiveRoomModule,
    LiveModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
