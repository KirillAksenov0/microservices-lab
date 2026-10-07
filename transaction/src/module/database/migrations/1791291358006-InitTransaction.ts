import { MigrationInterface, QueryRunner } from "typeorm";

export class InitTransaction1791291358006 implements MigrationInterface {
    name = 'InitTransaction1791291358006'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_type_enum" AS ENUM('WITHDRAWAL', 'DEPOSIT', 'TRANSFER')`);
        await queryRunner.query(`CREATE TYPE "public"."transaction_status_enum" AS ENUM('IN_PROGRESS', 'COMPLETED', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "transaction" ("created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "transaction_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "user_id" character varying NOT NULL, "amount" character varying NOT NULL, "type" "public"."transaction_type_enum" NOT NULL, "status" "public"."transaction_status_enum" NOT NULL DEFAULT 'IN_PROGRESS', CONSTRAINT "PK_6e02e5a0a6a7400e1c944d1e946" PRIMARY KEY ("transaction_id")); COMMENT ON COLUMN "transaction"."transaction_id" IS 'Идентификатор транзакции'; COMMENT ON COLUMN "transaction"."user_id" IS 'Идентификатор пользователя'; COMMENT ON COLUMN "transaction"."amount" IS 'Сумма в копейках'; COMMENT ON COLUMN "transaction"."type" IS 'Тип транзакции'; COMMENT ON COLUMN "transaction"."status" IS 'Статус транзакции'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "transaction"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_type_enum"`);
    }

}
