import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAuthorToEvent1706000990559 implements MigrationInterface {
    name = 'AddAuthorToEvent1706000990559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD CONSTRAINT \`FK_01cd2b829e0263917bf570cb672\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_01cd2b829e0263917bf570cb672\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`userId\``);
    }

}
