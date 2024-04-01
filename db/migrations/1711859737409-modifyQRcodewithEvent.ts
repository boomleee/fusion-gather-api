import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyQRcodewithEvent1711859737409 implements MigrationInterface {
    name = 'ModifyQRcodewithEvent1711859737409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_7812679849c61fb1dde3552e01c\``);
        await queryRunner.query(`DROP INDEX \`REL_7812679849c61fb1dde3552e01\` ON \`event\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`qrcodeId\``);
        await queryRunner.query(`ALTER TABLE \`qrcode\` ADD \`eventId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`qrcode\` ADD UNIQUE INDEX \`IDX_ca7f844b4c9f1ce68c7e4e214b\` (\`eventId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_ca7f844b4c9f1ce68c7e4e214b\` ON \`qrcode\` (\`eventId\`)`);
        await queryRunner.query(`ALTER TABLE \`qrcode\` ADD CONSTRAINT \`FK_ca7f844b4c9f1ce68c7e4e214b0\` FOREIGN KEY (\`eventId\`) REFERENCES \`event\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`qrcode\` DROP FOREIGN KEY \`FK_ca7f844b4c9f1ce68c7e4e214b0\``);
        await queryRunner.query(`DROP INDEX \`REL_ca7f844b4c9f1ce68c7e4e214b\` ON \`qrcode\``);
        await queryRunner.query(`ALTER TABLE \`qrcode\` DROP INDEX \`IDX_ca7f844b4c9f1ce68c7e4e214b\``);
        await queryRunner.query(`ALTER TABLE \`qrcode\` DROP COLUMN \`eventId\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`qrcodeId\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_7812679849c61fb1dde3552e01\` ON \`event\` (\`qrcodeId\`)`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD CONSTRAINT \`FK_7812679849c61fb1dde3552e01c\` FOREIGN KEY (\`qrcodeId\`) REFERENCES \`qrcode\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
