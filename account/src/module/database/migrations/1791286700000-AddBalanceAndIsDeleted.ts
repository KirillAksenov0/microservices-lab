import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBalanceAndIsDeleted1791286700000 implements MigrationInterface {
  name = 'AddBalanceAndIsDeleted1791286700000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ADD "balance" character varying NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "isDeleted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."balance" IS 'Баланс'`,
    );
    await queryRunner.query(
      `COMMENT ON COLUMN "user"."isDeleted" IS 'Был ли удалён аккаунт'`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_login" ON "user" ("login")`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_user_login_phone" ON "user" ("login", "phone")`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "public"."IDX_user_login_phone"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_user_login"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "isDeleted"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "balance"`);
  }
}