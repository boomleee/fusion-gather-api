import { MigrationInterface, QueryRunner } from "typeorm";

export class Location1709102712830 implements MigrationInterface {
    name = 'Location1709102712830'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`REL_45e8e0655f148c8ae4dd9d0cc8\` ON \`event\``);
        await queryRunner.query(`ALTER TABLE \`event\` DROP COLUMN \`eventLocationId\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`event\` ADD \`eventLocationId\` int NULL`);
        await queryRunner.query(`CREATE UNIQUE INDEX \`REL_45e8e0655f148c8ae4dd9d0cc8\` ON \`event\` (\`eventLocationId\`)`);
    }

}
