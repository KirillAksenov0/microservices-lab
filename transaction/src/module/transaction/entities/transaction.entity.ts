import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AbstractEntity } from '../../database/abstract.entity.js';
import { TransactionStatus, TransactionType } from '../transaction.types.js';

@Entity({ name: 'transaction' })
export class TransactionEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid', {
    comment: 'Идентификатор транзакции',
    name: 'transaction_id',
  })
  readonly id: string;

  @Column('varchar', {
    comment: 'Идентификатор пользователя',
    name: 'user_id',
    nullable: false,
  })
  userId: string;

  @Column('varchar', { comment: 'Сумма в копейках', nullable: false })
  amount: string;

  @Column('enum', {
    comment: 'Тип транзакции',
    name: 'type',
    nullable: false,
    enum: TransactionType,
  })
  type: TransactionType;

  @Column('enum', {
    comment: 'Статус транзакции',
    name: 'status',
    nullable: false,
    enum: TransactionStatus,
    default: TransactionStatus.IN_PROGRESS,
  })
  status: TransactionStatus;
}