import { MigrationInterface, QueryRunner } from "typeorm";

export class TestMigration1703417372044 implements MigrationInterface {
    name = 'TestMigration1703417372044'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_60328bf27019ff5498c4b97742\` ON \`account\``);
        await queryRunner.query(`ALTER TABLE \`account\` ADD \`isTrue\` tinyint NOT NULL DEFAULT 0`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`account\` DROP COLUMN \`isTrue\``);
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_60328bf27019ff5498c4b97742\` ON \`account\` (\`userId\`)`);
    }

}
