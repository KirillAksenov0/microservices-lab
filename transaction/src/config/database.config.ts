import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { PostgresConnectionCredentialsOptions } from 'typeorm/driver/postgres/PostgresConnectionCredentialsOptions.js';
import { TransactionEntity } from '../module/transaction/entities/transaction.entity.js';
import migrations from '../module/database/migrations/index.js';

export const databaseOptions = (
  config: ConfigService,
): TypeOrmModuleOptions & PostgresConnectionCredentialsOptions => ({
  type: config.get('DB_TYPE') as any,
  host: config.get('DB_HOST'),
  port: Number(config.get('DB_PORT')),
  username: config.get('DB_USERNAME'),
  password: config.get('DB_PASSWORD'),
  database: config.get('DB_DATABASE'),
  logging: config.get('DB_LOGGING') === true,
  synchronize: false,
  migrationsRun: config.get('DB_MIGRATIONS_RUN') === 'true',
  migrationsTableName: config.get('DB_MIGRATIONS_TABLE_NAME'),
  migrations,
  entities: [TransactionEntity],
  autoLoadEntities: true,
});