import { MigrationInterface, QueryRunner } from "typeorm";

export class PaymentforEvent1712246800939 implements MigrationInterface {
    name = 'PaymentforEvent1712246800939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_ca7f844b4c9f1ce68c7e4e214b\` ON \`qrcode\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`orderId\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`bankCode\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`orderInfo\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`orderType\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`locale\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`currCode\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`ipAddr\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`createDate\``);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`name\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`price\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`quantity\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`description\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`quantity\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`name\``);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`createDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`ipAddr\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`currCode\` varchar(255) NOT NULL DEFAULT 'VND'`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`locale\` varchar(255) NOT NULL DEFAULT 'vn'`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`orderType\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`orderInfo\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`bankCode\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`amount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`orderId\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_ca7f844b4c9f1ce68c7e4e214b\` ON \`qrcode\` (\`eventId\`)`);
    }

}
