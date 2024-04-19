import { MigrationInterface, QueryRunner } from "typeorm";

export class StripeWebhookv31713440606285 implements MigrationInterface {
    name = 'StripeWebhookv31713440606285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ticket\` DROP COLUMN \`paidStatus\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ticket\` ADD \`paidStatus\` varchar(255) NULL`);
    }

}
