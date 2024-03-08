import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAdminandisPublish1709864707997 implements MigrationInterface {
    name = 'AddAdminandisPublish1709864707997'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`isAdmin\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`isPublished\` tinyint NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_7812679849c61fb1dde3552e01c\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD UNIQUE INDEX \`IDX_7812679849c61fb1dde3552e01\` (\`qrcodeId\`)`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_7812679849c61fb1dde3552e01\` ON \`event\` (\`qrcodeId\`)`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD CONSTRAINT \`FK_7812679849c61fb1dde3552e01c\` FOREIGN KEY (\`qrcodeId\`) REFERENCES \`qrcode\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_7812679849c61fb1dde3552e01c\``);
        await queryRunner.query(`DROP INDEX \`REL_7812679849c61fb1dde3552e01\` ON \`event\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP INDEX \`IDX_7812679849c61fb1dde3552e01\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD CONSTRAINT \`FK_7812679849c61fb1dde3552e01c\` FOREIGN KEY (\`qrcodeId\`) REFERENCES \`qrcode\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`isPublished\``);
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`isAdmin\``);
    }

}
