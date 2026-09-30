import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { UserEntity } from '../module/user/entities/user.entity.js';
import migrations from '../module/database/migrations/index.js';

const ENV_FILE = '.env';

dotenv.config({ path: ENV_FILE });

export default new DataSource({
  type: 'postgres',

  host: process.env.DB_HOST,

  username: process.env.DB_USERNAME,

  password: process.env.DB_PASSWORD,

  database: process.env.DB_DATABASE,

  port: Number(process.env.DB_PORT),

  synchronize: false,

  entities: [UserEntity],

  migrations,

  migrationsRun: process.env.DB_MIGRATIONS_RUN === 'true',

  migrationsTableName: process.env.DB_MIGRATIONS_TABLE_NAME,
});