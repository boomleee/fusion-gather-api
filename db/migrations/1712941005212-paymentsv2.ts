import { MigrationInterface, QueryRunner } from "typeorm";

export class Paymentsv21712941005212 implements MigrationInterface {
    name = 'Paymentsv21712941005212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_028e6e271fe2283d03953a034d\` ON \`qrcode\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`orderId\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`amount\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`bankCode\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`orderInfo\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`orderType\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`locale\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`currCode\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`ipAddr\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`createDate\``);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`price\` decimal(10,2) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`quantity\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`paid\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`ticketId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD UNIQUE INDEX \`IDX_49b4a839e33590d1f711489597\` (\`ticketId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_49b4a839e33590d1f711489597\` ON \`payment\` (\`ticketId\`)`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_49b4a839e33590d1f711489597b\` FOREIGN KEY (\`ticketId\`) REFERENCES \`ticket\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_49b4a839e33590d1f711489597b\``);
        await queryRunner.query(`DROP INDEX \`REL_49b4a839e33590d1f711489597\` ON \`payment\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP INDEX \`IDX_49b4a839e33590d1f711489597\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`ticketId\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`createdAt\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`paid\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`quantity\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP COLUMN \`price\``);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`createDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`ipAddr\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`currCode\` varchar(255) NOT NULL DEFAULT 'VND'`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`locale\` varchar(255) NOT NULL DEFAULT 'vn'`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`orderType\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`orderInfo\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`bankCode\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`amount\` decimal NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD \`orderId\` varchar(255) NOT NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_028e6e271fe2283d03953a034d\` ON \`qrcode\` (\`boothId\`)`);
    }

}
