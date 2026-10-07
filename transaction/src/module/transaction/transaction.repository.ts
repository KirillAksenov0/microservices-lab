import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository, SelectQueryBuilder } from 'typeorm';
import { TransactionEntity } from './entities/transaction.entity.js';
import { FindTransactionParams, TransactionStatus } from './transaction.types.js';

export class TransactionRepository {
  constructor(
    @InjectRepository(TransactionEntity)
    private readonly repo: Repository<TransactionEntity>,
  ) {}

  async createTransaction<T extends DeepPartial<TransactionEntity>>(
    entity: T,
  ): Promise<TransactionEntity> {
    return this.repo.save(entity);
  }

  async updateStatus(id: string, status: TransactionStatus): Promise<void> {
    await this.repo.update({ id }, { status });
  }

  async findById(id: string): Promise<TransactionEntity | null> {
    return this.repo.findOneBy({ id });
  }

  async findByParams(params: FindTransactionParams): Promise<{ items: TransactionEntity[]; total: number }> {
    const [items, total] = await this.qb(params).getManyAndCount();
    return { items, total };
  }

  qb(params: FindTransactionParams = {}, alias = 'transaction'): SelectQueryBuilder<TransactionEntity> {
    const { userIds, ids, amounts, type, status, take, skip } = params;
    const query = this.repo.createQueryBuilder(alias);

    if (userIds?.length) query.andWhere(`${alias}.userId IN (:...userIds)`, { userIds });
    if (ids?.length) query.andWhere(`${alias}.id IN (:...ids)`, { ids });
    if (amounts?.length) query.andWhere(`${alias}.amount IN (:...amounts)`, { amounts });
    if (type) query.andWhere(`${alias}.type = :type`, { type });
    if (status) query.andWhere(`${alias}.status = :status`, { status });
    if (take) query.take(take);
    if (skip) query.skip(skip);
    return query;
  }
}