import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyBooth1709101658870 implements MigrationInterface {
    name = 'ModifyBooth1709101658870'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`booth\` ADD \`latitude\` decimal(17,14) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`booth\` ADD \`longitude\` decimal(17,14) NOT NULL`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`boothLocation\` DROP FOREIGN KEY \`FK_6af25cabf7184ca1f6d7fed7500\``);
        await queryRunner.query(`ALTER TABLE \`boothLocation\` DROP FOREIGN KEY \`FK_78523cc4fa53616a5e02838ba27\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP FOREIGN KEY \`FK_45e8e0655f148c8ae4dd9d0cc88\``);
        await queryRunner.query(`ALTER TABLE \`booth\` DROP COLUMN \`longitude\``);
        await queryRunner.query(`ALTER TABLE \`booth\` DROP COLUMN \`latitude\``);
        await queryRunner.query(`DROP INDEX \`REL_78523cc4fa53616a5e02838ba2\` ON \`boothLocation\``);
        await queryRunner.query(`DROP TABLE \`boothLocation\``);
        await queryRunner.query(`DROP TABLE \`eventLocation\``);
        await queryRunner.query(`ALTER TABLE \`event\` ADD CONSTRAINT \`FK_45e8e0655f148c8ae4dd9d0cc88\` FOREIGN KEY (\`eventLocationId\`) REFERENCES \`eventlocation\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
