import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentforEvent1712249232021 implements MigrationInterface {
    name = 'PaymentforEvent1712249232021'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`paid\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`paid\``);
    }

}
