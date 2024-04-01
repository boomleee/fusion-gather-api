import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyQRcode1711853246200 implements MigrationInterface {
    name = 'ModifyQRcode1711853246200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`qrcode\` CHANGE \`code\` \`qrCode\` longblob NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`qrcode\` DROP COLUMN \`qrCode\``);
        await queryRunner.query(`ALTER TABLE \`qrcode\` ADD \`qrCode\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`qrcode\` DROP COLUMN \`qrCode\``);
        await queryRunner.query(`ALTER TABLE \`qrcode\` ADD \`qrCode\` longblob NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`qrcode\` CHANGE \`qrCode\` \`code\` longblob NOT NULL`);
    }

}
