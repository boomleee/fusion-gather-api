import { MigrationInterface, QueryRunner } from "typeorm";

export class Payment1711779050841 implements MigrationInterface {
    name = 'Payment1711779050841'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`payment\` (\`id\` int NOT NULL AUTO_INCREMENT, \`orderId\` varchar(255) NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`bankCode\` varchar(255) NOT NULL, \`orderInfo\` varchar(255) NOT NULL, \`orderType\` varchar(255) NOT NULL, \`locale\` varchar(255) NOT NULL DEFAULT 'vn', \`currCode\` varchar(255) NOT NULL DEFAULT 'VND', \`ipAddr\` varchar(255) NOT NULL, \`createDate\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`userId\` int NULL, \`eventId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_b046318e0b341a7f72110b75857\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`payment\` ADD CONSTRAINT \`FK_7acc01aea1ff8f19abf62781770\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_7acc01aea1ff8f19abf62781770\``);
        await queryRunner.query(`ALTER TABLE \`payment\` DROP FOREIGN KEY \`FK_b046318e0b341a7f72110b75857\``);
        await queryRunner.query(`DROP TABLE \`payment\``);
    }

}
