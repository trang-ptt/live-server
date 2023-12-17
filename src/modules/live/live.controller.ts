import { Controller, Get, Post } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from '../auth/decorator';
import { LiveService } from './live.service';

@Controller('live')
export class LiveController {
  constructor(private liveService: LiveService) {}
  @Get('list')
  getList() {
    const result = this.liveService.getList();
    return result;
  }

  @Post('close_live')
  async closeLive(@GetUser() user: User) {
    const result = await this.closeLive(user);
    return result;
  }

  @Get('is_live')
  async isLive(@GetUser() user: User) {
    const result = await this.liveService.isLive(user);
    return result;
  }
}
