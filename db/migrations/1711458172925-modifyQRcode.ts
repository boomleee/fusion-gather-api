import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyQRcode1711458172925 implements MigrationInterface {
    name = 'ModifyQRcode1711458172925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`qrcode\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`qrcode\` ADD \`code\` longblob NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`qrcode\` DROP COLUMN \`code\``);
        await queryRunner.query(`ALTER TABLE \`qrcode\` ADD \`code\` varchar(255) NOT NULL`);
    }

}
