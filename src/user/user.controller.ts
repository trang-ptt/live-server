import { Controller } from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/modules/auth/decorator';

@Controller('user')
export class UserController {
  getMe(@GetUser() user: User) {
    return user;
  }
}
