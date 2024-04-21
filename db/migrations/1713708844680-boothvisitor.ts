import { MigrationInterface, QueryRunner } from "typeorm";

export class Boothvisitor1713708844680 implements MigrationInterface {
    name = 'Boothvisitor1713708844680'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`boothvisitor\` (\`userId\` int NOT NULL, \`boothId\` int NOT NULL, PRIMARY KEY (\`userId\`, \`boothId\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`boothvisitor\``);
    }

}
