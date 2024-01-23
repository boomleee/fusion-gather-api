import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNewFieldToEvent1705998318733 implements MigrationInterface {
    name = 'AddNewFieldToEvent1705998318733'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`lng\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`lat\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`isFree\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`title\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`description\` text NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`description\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`description\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`title\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`title\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`isFree\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`lat\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`lng\``);
    }

}
