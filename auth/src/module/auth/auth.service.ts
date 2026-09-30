import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import type { Algorithm } from 'jsonwebtoken';
import type { JwtSignOptions } from '@nestjs/jwt';
import type { Redis } from 'ioredis';

import { REDIS_TOKEN } from '@lab/shared/redis';
import { InternalAccountService } from '../../internal/account/account.service.js';

import { SignInDto } from './dto/sign-in.dto.js';
import { JwtDto, RefreshJwtDto } from './dto/jwt.dto.js';

type JwtPayload = {
  login: string;
  userId: string;
};

@Injectable()
export class AuthService {
  constructor(
    @Inject(REDIS_TOKEN) private readonly redis: Redis,
    private readonly accountServiceInternal: InternalAccountService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login(params: SignInDto): Promise<JwtDto> {
    const isPasswordCorrect =
      await this.accountServiceInternal.verification(params);

    if (!isPasswordCorrect) {
      throw new UnauthorizedException();
    }

    let userId = await this.redis.get(params.login);

    if (!userId) {
      const users =
        await this.accountServiceInternal.GetUsersByFilter({
          login: params.login,
        });

      if (!users.items.length) {
        throw new NotFoundException('user not found');
      }

      userId = users.items[0].userId;

      await this.redis.set(params.login, userId);
    }

    const payload: JwtPayload = {
      login: params.login,
      userId,
    };

    const access = this.signAccess(payload);
    const refresh = this.signRefresh(payload);

    await this.redis.set(userId, refresh);

    return { access, refresh };
  }

  async refreshToken(params: RefreshJwtDto): Promise<JwtDto> {
    let jwtPayload: JwtPayload;

    try {
      jwtPayload = this.jwtService.verify(params.refresh, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        algorithms: [this.getAlgorithm()],
      });
    } catch (error: unknown) {
      throw new UnauthorizedException();
    }

    const storedRefresh = await this.redis.get(jwtPayload.userId);

    if (storedRefresh !== params.refresh) {
      throw new UnauthorizedException();
    }

    const { items: users } =
      await this.accountServiceInternal.GetUsersByFilter({
        userIds: [jwtPayload.userId],
      });

    if (!users.length) {
      throw new NotFoundException('user not found');
    }

    const payload: JwtPayload = {
      login: users[0].login,
      userId: users[0].userId,
    };

    const access = this.signAccess(payload);
    const refresh = this.signRefresh(payload);

    await this.redis.set(payload.userId, refresh);

    return { access, refresh };
  }

  private getAlgorithm(): Algorithm {
    const alg = this.config.get<Algorithm>('JWT_ALG');

    if (!alg) {
      throw new Error('JWT_ALG is not defined in environment');
    }

    return alg;
  }

  private signAccess(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_ACCESS_SECRET'),
      algorithm: this.getAlgorithm(),
      expiresIn: this.config.get<string>(
        'JWT_ACCESS_EXP',
      ) as JwtSignOptions['expiresIn'],
    });
  }

  private signRefresh(payload: JwtPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      algorithm: this.getAlgorithm(),
      expiresIn: this.config.get<string>(
        'JWT_REFRESH_EXP',
      ) as JwtSignOptions['expiresIn'],
    });
  }
}