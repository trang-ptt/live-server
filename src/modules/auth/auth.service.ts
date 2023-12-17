import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import * as argon from 'argon2';
import { PrismaService } from '../../prisma/prisma.service';
import { SignInDto } from './dto/sign-in.dto';

@Injectable({})
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  validateEmail = (email: string) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      );
  };

  async signIn(dto: SignInDto) {
    //find user by email or username
    let user: User = null;
    if (this.validateEmail(dto.emailOrUsername)) {
      user = await this.prisma.user.findUnique({
        where: {
          email: dto.emailOrUsername,
        },
      });
    } else {
      user = await this.prisma.user.findUnique({
        where: {
          username: dto.emailOrUsername,
        },
      });
    }
    if (!user) {
      //if user not exist throw
      throw new ForbiddenException("user's not exist");
    }

    if (user.accessFailedCount > 0)
      throw new ForbiddenException("user's BANNED");
    //compare password
    const pwMatches = await argon.verify(user.password, dto.password);
    //if password incorrect throw
    if (!pwMatches) {
      throw new ForbiddenException('Password incorrect');
    }
    //send back user
    delete user.password;
    return this.signToken(user.id, user.email);
  }

  async signToken(userId: string, email: string) {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get('JWT_SECRET');

    const token = await this.jwt.signAsync(payload, {
      // expiresIn: '24h',
      secret: secret,
    });

    return {
      access_token: token,
    };
  }

  verifyJwt(token: string): Promise<any> {
    return this.jwt.verifyAsync(token, {
      secret: process.env.JWT_SECRET,
    });
  }
}
