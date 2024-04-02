import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBoothQRCode1712027440116 implements MigrationInterface {
    name = 'AddBoothQRCode1712027440116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_ca7f844b4c9f1ce68c7e4e214b\` ON \`qrcode\``);
        await queryRunner.query(`ALTER TABLE \`qrcode\` ADD \`boothId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`qrcode\` ADD UNIQUE INDEX \`IDX_028e6e271fe2283d03953a034d\` (\`boothId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_028e6e271fe2283d03953a034d\` ON \`qrcode\` (\`boothId\`)`);
        await queryRunner.query(`ALTER TABLE \`qrcode\` ADD CONSTRAINT \`FK_028e6e271fe2283d03953a034db\` FOREIGN KEY (\`boothId\`) REFERENCES \`booth\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`qrcode\` DROP FOREIGN KEY \`FK_028e6e271fe2283d03953a034db\``);
        await queryRunner.query(`DROP INDEX \`REL_028e6e271fe2283d03953a034d\` ON \`qrcode\``);
        await queryRunner.query(`ALTER TABLE \`qrcode\` DROP INDEX \`IDX_028e6e271fe2283d03953a034d\``);
        await queryRunner.query(`ALTER TABLE \`qrcode\` DROP COLUMN \`boothId\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_ca7f844b4c9f1ce68c7e4e214b\` ON \`qrcode\` (\`eventId\`)`);
    }

}
