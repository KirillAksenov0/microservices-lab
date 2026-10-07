import * as crypto from 'node:crypto';
import * as argon from 'argon2';

import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import type { Redis } from 'ioredis';

import { REDIS_TOKEN } from '@lab/shared/redis';
import { KafkaService } from '@lab/shared/kafka';

import { CreateUserDto } from './dto/create-user.dto.js';
import GetUserFilterDto from './dto/get-users-filter.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserDto } from './dto/user.dto.js';
import { UserRepository } from './user.repository.js';
import { SignInDto } from './dto/sign-in.dto.js';
import { ChangeBalanceDto } from './dto/change-balance.dto.js';
import {
  BalanceChangedStatus,
  EventBalanceChangedData,
  EventNameEnum,
  EventTransactionSavedData,
  TransactionType,
} from './user.types.js';

@Injectable()
export class UserService {
  constructor(
    @Inject(REDIS_TOKEN) private readonly redis: Redis,
    private readonly userRepository: UserRepository,
    private readonly kafkaService: KafkaService,
  ) {}

  async create(user: CreateUserDto): Promise<UserDto> {
    const userExist = await this.userRepository.checkExistUser({
      phone: user.phone,
      login: user.login,
    });

    if (userExist) {
      throw new ConflictException('User already exist');
    }

    const salt = crypto.randomBytes(32);

    const hash = await argon.hash(user.password, { salt });

    const createdUser = await this.userRepository.createUser({
      passwordHash: hash,
      passwordSalt: salt.toString('hex'),
      ...user,
    });

    return new UserDto(createdUser);
  }

  async findAll(
    getUserFilterDto: GetUserFilterDto,
  ): Promise<{
    items: UserDto[];
    total: number;
  }> {
    const { items: users, total } =
      await this.userRepository.findAndCount(getUserFilterDto);

    const dtos = users.map((user) => new UserDto(user));

    return { items: dtos, total };
  }

  async findOne(id: string): Promise<UserDto | null> {
    const user = await this.userRepository.findById(id);

    return user ? new UserDto(user) : null;
  }

  async update(userId: string, dto: UpdateUserDto): Promise<void> {
    await this.userRepository.updateUser(userId, dto);
  }

  async remove(id: string): Promise<void> {
    const user = await this.userRepository.findById(id);

    if (user) {
      await this.redis.del(user.login);
      await this.redis.del(user.userId);
    }

    await this.userRepository.deleteUser(id);
  }

  async verification({ login, password }: SignInDto): Promise<boolean> {
    const user = await this.userRepository.findByLogin(login);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return argon.verify(user.passwordHash, password);
  }

  /**
   * Обрабатывает событие TransactionSaved из Kafka.
   * Меняет баланс и публикует результат в BalanceChanged.
   */
  async changeBalance(event: EventTransactionSavedData): Promise<void> {
    const { userId, amount, transactionId, transactionType } = event;
    let status = BalanceChangedStatus.COMPLETED;

    try {
      const user = await this.userRepository.findById(userId);

      if (!user) {
        throw new NotFoundException('User not found');
      }

      const currentBalance = Number(user.balance);
      const delta = Number(amount);

      const newBalance =
        transactionType === TransactionType.WITHDRAWAL
          ? currentBalance - delta
          : currentBalance + delta;

      if (newBalance < 0) {
        throw new ConflictException('Insufficient funds');
      }

      await this.userRepository.changeBalance({
        userId,
        balance: newBalance.toString(),
      });
    } catch {
      status = BalanceChangedStatus.FAILED;
    }

    const response: EventBalanceChangedData = { transactionId, status };

    await this.kafkaService.produce({
      eventName: EventNameEnum.BalanceChanged,
      data: response,
    });
  }

  /**
   * HTTP-версия изменения баланса для ручного тестирования через Swagger.
   * В отличие от Kafka-версии, бросает исключения наружу.
   */
  async changeBalanceFromHttp(dto: ChangeBalanceDto): Promise<void> {
    const user = await this.userRepository.findById(dto.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const currentBalance = Number(user.balance);
    const delta = Number(dto.amount);

    const newBalance =
      dto.transactionType === TransactionType.WITHDRAWAL
        ? currentBalance - delta
        : currentBalance + delta;

    if (newBalance < 0) {
      throw new ConflictException('Insufficient funds');
    }

    await this.userRepository.changeBalance({
      userId: dto.userId,
      balance: newBalance.toString(),
    });
  }
}