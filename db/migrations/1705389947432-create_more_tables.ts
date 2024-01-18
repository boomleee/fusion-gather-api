import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateMoreTables1705389947432 implements MigrationInterface {
    name = 'CreateMoreTables1705389947432'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`IDX_60328bf27019ff5498c4b97742\` ON \`account\``);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE UNIQUE INDEX \`IDX_60328bf27019ff5498c4b97742\` ON \`account\` (\`userId\`)`);
    }

}
